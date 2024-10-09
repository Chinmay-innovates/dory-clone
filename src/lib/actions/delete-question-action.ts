"use server";

import routes from "@/config/routes";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {revalidatePath} from "next/cache";
import {prisma} from "../prisma/client";
import {actionClient} from "./safe-action";
import {getQuestionSchema} from "@/lib/schema-validations/question-schemas";

export const deleteQuestionAction = actionClient
    .schema(getQuestionSchema)
    .action(async ({parsedInput: {questionId}}) => {
        const user = await getKindeServerSession().getUser();

        if (!user) {
            throw new Error("Not authenticated");
        }

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
                    },
                },
                authorId: true,
            },
        });

        if (!question) {
            throw new Error("Question not found!");
        }

        //     Check the user permission
        if (question.event.ownerId !== user.id && question.authorId !== user.id) {
            throw new Error("Permission denied");
        }
        // delete question
        await prisma.question.delete({
            where: {
                id: questionId,
            },
        });

        // to refresh the UI
        revalidatePath(
            routes.event({
                eventSlug: question.event.slug,
                ownerId: question.event.ownerId,
            })
        );
    });
