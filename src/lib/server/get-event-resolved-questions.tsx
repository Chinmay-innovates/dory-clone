import {cache} from "react";
import {Question, User, Event} from "@prisma/client";
import {QuestionsOrderBy} from "@/lib/utils/question-utils";
import {prisma} from "@/lib/prisma/client";
import {questionDetail, questionsOrderBy} from "@/lib/prisma/validators/question-validator";

type  Params = {
    ownerId: User["id"];
    eventSlug: Event["slug"];
    orderBy?: QuestionsOrderBy;
    cursor?: Question["id"];
    filters?: {
        questionId?: Question["id"];
    };
}
export const getEventResolvedQuestions = cache(
    async ({ownerId, eventSlug, orderBy = "most-popular", cursor, filters,}: Params) => {
        return prisma.question.findMany({
            where: {
                event: {
                    ownerId,
                    slug: eventSlug
                },
                isResolved: true,
                ...(filters?.questionId? {id:filters.questionId}:{})
            },
            ...questionDetail,
            orderBy: [
                {isPinned: "desc"}, {
                    ...questionsOrderBy(orderBy)
                }
            ],
            take: 10,
            skip: cursor ? 1 : 0,
            ...(cursor ? {cursor: {id: cursor}} : {}),
        })
    })