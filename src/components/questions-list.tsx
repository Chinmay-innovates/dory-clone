"use client"
import {cn, PropsWithClassName} from "@/lib/utils/ui-utils";
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {User, Event} from "@prisma/client";
import {QuestionsOrderBy} from "@/lib/utils/question-utils";
import {useCallback, useState} from "react";
import {useSearchParams} from "next/navigation";
import {NoContent} from "@/components/illustrations";
import {Question} from "@/components/question";

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

    return (
        <div className={cn("space-y-8 pb-10", className)}>
            {questions.length === 0 ? (
                <NoContent>
          <span className="tracking-tight font-light mt-3">
            No questions has been asked yet.
          </span>
                </NoContent>
            ) : (
                initialQuestions.map((question) => (
                    <Question key={question.id} question={question}/>
                ))
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
                initialQuestions.map((question) => (
                    <Question key={question.id} question={question}/>
                ))
            )}
        </div>
    );
};