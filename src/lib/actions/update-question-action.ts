"use server"
import {actionClient} from "@/lib/actions/safe-action";
import {updateQuestionSchema} from "@/lib/schema-validations/question-schemas";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {prisma} from "@/lib/prisma/client";

export const updateQuestionAction = actionClient
    .schema(updateQuestionSchema)
    .action(async ({parsedInput: {questionId, ...fields}}) => {
        const user = await getKindeServerSession().getUser();
        if (!user) {
            throw new Error("Not authenticated!");
        }
        //     Find the question
        const question = await prisma.question.findUnique({
            where: {
                id: questionId,
            },
            select: {
                event: {
                    select: {
                        id: true,
                        ownerId: true,
                        slug: true,
                    }
                },
                authorId: true,
            }
        });
        if (!question) {
            throw new Error("Question not found");
        }

        //     Check the user permission
        if (question.event.ownerId !== user.id && question.authorId !== user.id) {
            throw new Error("Permission denied");
        }

        //     update the question
        await prisma.$transaction([
            prisma.question.update({
                where: {
                    id: questionId
                },
                data: fields
            })
        ])

        return {
            questionId,
            ...fields
        }
    })