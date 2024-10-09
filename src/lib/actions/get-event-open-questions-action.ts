"use server";

import {z} from "zod";
import {actionClient} from "@/lib/actions/safe-action";
import {getEventOpenQuestions} from "@/lib/server/get-event-open-questions";
import {eventPublicIdSchema} from "@/lib/schema-validations/event-schemas";
import {questionIdSchema, questionOrderBySchema} from "@/lib/schema-validations/question-schemas";

export const getEventOpenQuestionsAction = actionClient
    .schema(
        z
            .object({
                cursor: questionIdSchema.optional(),
                orderBy: questionOrderBySchema.optional(),
                questionId: questionIdSchema.optional(),
            })
            .merge(eventPublicIdSchema)
    )
    .action(
        async ({
                   parsedInput: {cursor, ownerId, eventSlug, orderBy, questionId},
               }) =>
            getEventOpenQuestions({
                ownerId,
                eventSlug,
                orderBy,
                cursor,
                ...(questionId ? {filters: {questionId}} : {}),
            })
    );