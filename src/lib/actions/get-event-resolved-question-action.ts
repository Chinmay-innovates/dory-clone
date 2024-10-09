"use server";

import {z} from "zod";
import {actionClient} from "@/lib/actions/safe-action";
import {questionIdSchema, questionOrderBySchema} from "@/lib/schema-validations/question-schemas";
import {eventPublicIdSchema} from "@/lib/schema-validations/event-schemas";
import {getEventResolvedQuestions} from "@/lib/server/get-event-resolved-questions";


export const getEventResolvedQuestionsAction = actionClient
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
                   parsedInput: {eventSlug, ownerId, cursor, orderBy, questionId},
               }) =>
            getEventResolvedQuestions({
                ownerId,
                eventSlug,
                cursor,
                orderBy,
                ...(questionId ? {filters: {questionId}} : {}),
            })
    );
