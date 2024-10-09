"use server"
import {actionClient} from "@/lib/actions/safe-action";
import {createQuestionSchema} from "@/lib/schema-validations/question-schemas";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {prisma} from "@/lib/prisma/client";
import {questionDetail} from "@/lib/prisma/validators/question-validator";

export const createQuestionAction = actionClient
    .schema(createQuestionSchema)
    .action(async ({parsedInput: {ownerId, body, eventSlug}}) => {
        const user = await getKindeServerSession().getUser();
        if (!user) {
            throw new Error("Not authenticated!");
        }
        //     Find the event
        const event = await prisma.event.findUnique({
            where: {
                slug_ownerId: {
                    ownerId,
                    slug: eventSlug
                }
            }
        })

        if (!event) {
            throw new Error("Event not found!");
        }

        //     Perform action
        const [newQuestion] = await prisma.$transaction(([
            prisma.question.create({
                data: {
                    body,
                    authorId: user.id,
                    eventId: event.id,
                },
                ...questionDetail,
            }),
            //     add user a participant, only if it is not already in
            prisma.eventParticipant.upsert({
                where: {
                    eventId_userId: {
                        eventId: event.id,
                        userId: user.id
                    }
                },
                create: {
                    eventId: event.id,
                    userId: user.id
                },
                update: {}
            })
        ]))

        return newQuestion;
    })
