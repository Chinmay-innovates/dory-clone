"use client"
import {cn, PropsWithClassName} from "@/lib/utils/ui-utils";
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {Event, User} from "@prisma/client";
import {QuestionsOrderBy} from "@/lib/utils/question-utils";
import {useCallback, useState} from "react";
import {useSearchParams} from "next/navigation";
import {NoContent} from "@/components/illustrations";
import {Question} from "@/components/question";
import {CreateQuestionForm} from "@/components/forms/create-question-form";
import {InfiniteScrollList} from "@/components/infinite-scroll-list";
import {useAction} from "next-safe-action/hooks";
import {getEventOpenQuestionsAction} from "@/lib/actions/get-event-open-questions-action";
import {getEventResolvedQuestionsAction} from "@/lib/actions/get-event-resolved-question-action";

type Props = PropsWithClassName<{
    initialQuestions: QuestionDetail[];
    ownerId: User["id"];
    eventSlug: Event["slug"];
    orderBy: QuestionsOrderBy;
    questionId?: QuestionDetail["id"];
}>;

export const OpenQuestionsList = ({initialQuestions, ownerId, eventSlug, orderBy, className, questionId,}: Props) => {
    const [questions, setQuestions] = useState(initialQuestions);

    const searchParams = useSearchParams();

    const hasFilters = !!questionId;

    const {executeAsync} = useAction(getEventOpenQuestionsAction);

    const fetchMoreOpenQuestions = useCallback(
        async ({cursor}: { cursor?: QuestionDetail["id"] }) => {
            const newQuestions = await executeAsync({
                cursor,
                eventSlug,
                ownerId,
                orderBy,
                questionId,
            });

            if (!newQuestions?.data || newQuestions.data.length === 0) {
                return [];
            }

            return newQuestions.data;
        },
        [executeAsync, eventSlug, orderBy, ownerId, questionId]
    );

    return (
        <div className={cn("space-y-8 pb-10", className)}>

            {!hasFilters && (
                <CreateQuestionForm
                    ownerId={ownerId}
                    eventSlug={eventSlug}
                    onSuccess={(newQuestion: QuestionDetail) => setQuestions([newQuestion, ...questions])}
                />
            )}
            {questions.length === 0 ? (
                <NoContent>
          <span className="tracking-tight font-light mt-3">
            No questions has been asked yet.
          </span>
                </NoContent>
            ) : (
                <InfiniteScrollList<QuestionDetail>
                    key={`open-${searchParams.toString()}`}
                    items={questions}
                    setItems={setQuestions}
                    fetchMore={fetchMoreOpenQuestions}
                    renderItem={(question) =>
                        // @ts-ignore
                        <Question key={question.id} question={question}/>
                    }
                />
            )}
        </div>
    );
};

export const ResolvedQuestionsList = ({
                                          initialQuestions,
                                          ownerId,
                                          eventSlug,
                                          orderBy,
                                          className,
                                          questionId,
                                      }: Props) => {
    const [questions, setQuestions] = useState(initialQuestions);

    const searchParams = useSearchParams();

    const {executeAsync} = useAction(getEventResolvedQuestionsAction);

    const fetchMoreResolvedQuestions = useCallback(
        async ({cursor}: { cursor?: QuestionDetail["id"] }) => {
            const newQuestions = await executeAsync({
                cursor,
                eventSlug,
                ownerId,
                orderBy,
                questionId,
            });

            if (!newQuestions?.data || newQuestions.data.length === 0) {
                return [];
            }

            return newQuestions.data;
        },
        [executeAsync, eventSlug, orderBy, ownerId, questionId]
    );

    const hasFilters = !!questionId;

    return (
        <div className={cn("space-y-8 pb-10", className)}>
            {questions.length === 0 ? (
                <NoContent>
          <span className="tracking-tight font-light mt-3">
            No questions has been resolved yet.
          </span>
                </NoContent>
            ) : (
                <InfiniteScrollList<QuestionDetail>
                    key={`resolved-${searchParams.toString()}`}
                    items={questions}
                    setItems={setQuestions}
                    fetchMore={fetchMoreResolvedQuestions}
                    renderItem={(question) =>
                        // @ts-ignore
                        <Question key={question.id} question={question}/>
                    }
                />
            )}
        </div>
    );
};