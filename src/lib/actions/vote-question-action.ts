"use server";

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {getQuestionSchema} from "@/lib/schema-validations/question-schemas";
import {actionClient} from "@/lib/actions/safe-action";
import {prisma} from "@/lib/prisma/client";

export const voteQuestionAction = actionClient
    .schema(getQuestionSchema)
    .action(async ({parsedInput: {questionId}}) => {
        const user = await getKindeServerSession().getUser();

        if (!user) {
            throw new Error("Not authenticated");
        }

        // find the question
        const question = await prisma.question.findUnique({
            where: {
                id: questionId,
            },
            include: {
                upVotes: {
                    where: {
                        authorId: user.id,
                        questionId: questionId,
                    },
                },
                event: {
                    select: {
                        slug: true,
                        ownerId: true,
                    },
                },
            },
        });

        if (!question) {
            throw new Error("Question not found!");
        }

        // if the question has been resolved no more votes are allowed
        if (question.isResolved) {
            return;
        }

        const wasUpvotedByUser = question.upVotes.length > 0;

        if (wasUpvotedByUser) {
            // just remove the upvote
            await prisma.questionUpVote.delete({
                where: {
                    authorId_questionId: {
                        questionId,
                        authorId: user.id,
                    },
                },
            });

            return true;
        }

        // the user has not upVoted this question
        await prisma.$transaction([
            // create upvote
            prisma.questionUpVote.create({
                data: {
                    authorId: user.id,
                    questionId,
                },
            }),
            // add the user as participant to the event if not already in
            prisma.eventParticipant.upsert({
                where: {
                    eventId_userId: {
                        eventId: question.eventId,
                        userId: user.id,
                    },
                },
                create: {
                    eventId: question.eventId,
                    userId: user.id,
                },
                update: {},
            }),
        ]);

        return true;
    });
