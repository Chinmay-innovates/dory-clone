import {Suspense} from "react";
import {QuestionsTabNavigation} from "@/components/layout/questions-tab-navigation";
import {RefreshButton} from "@/components/buttons/refresh-button";
import {QuestionsSortBySelect} from "@/components/selects/question-sort-by-select";
import {QuestionsOrderBy} from "@/lib/utils/question-utils";
import {ClearSearchParamsButton} from "@/components/buttons/clear-search-params-button";
import {Loader} from "@/components/loader";
import {OpenQuestionsList, ResolvedQuestionsList} from "@/components/questions-list";
import {getEventResolvedQuestions} from "@/lib/server/get-event-resolved-questions";
import {getEventOpenQuestions} from "@/lib/server/get-event-open-questions";

type PathParams = {
    ownerId: string,
    eventSlug: string,
}
type SearchParams = {
    sortBy: QuestionsOrderBy,
    questionId: string,
    resolved: string
}
const QuestionsPage = async ({params: {ownerId, eventSlug}, searchParams}: {
    params: PathParams,
    searchParams?: SearchParams
}) => {
    const orderBy = searchParams?.sortBy ?? "newest";
    const showResolved = searchParams?.resolved === "true";
    const questionId = searchParams?.questionId;

    const hasFilters = !!questionId;
    return <>
        <div className="flex justify-between">
            {/*Open or Resolved*/}
            <QuestionsTabNavigation ownerId={ownerId} eventSlug={eventSlug}/>
            <div className="inline-flex items-center lg:gap-x-5">
                <RefreshButton/>

                <div className="inline-flex items-center p-0.5 lg:gap-x-2">
                    <span className="hidden lg:inline-block text-nowrap text-sm text-gray-500">
                    Sort By:
                    </span>
                    <QuestionsSortBySelect sortBy={orderBy}/>
                </div>
            </div>
        </div>

        {/* Clear Filter Option */}
        {hasFilters && (
            <div className="flex mt-4 items-center ">
                <p>You have active filters!</p>
                <ClearSearchParamsButton/>
            </div>
        )}
        {/* List of questions */}
        {/* List of questions */}
        <Suspense key={Date.now()} fallback={<Loader/>}>
            <Questions
                ownerId={ownerId}
                eventSlug={eventSlug}
                showResolved={showResolved}
                orderBy={orderBy}
                questionId={questionId}
            />
        </Suspense>

    </>
}

const Questions = async ({eventSlug, ownerId, showResolved, orderBy = "newest", questionId,}: {
    showResolved: boolean;
    ownerId: string;
    eventSlug: string;
    questionId?: string;
    orderBy?: QuestionsOrderBy;
}) => {
    const fetchQuestions = showResolved
        ? getEventResolvedQuestions
        : getEventOpenQuestions;

    // open or resolved questions
    const questions = await fetchQuestions({
        ownerId,
        eventSlug,
        orderBy,
        ...(questionId ? {filters: {questionId}} : {}),
    });

    return showResolved ? (
        <ResolvedQuestionsList
            initialQuestions={questions}
            ownerId={ownerId}
            eventSlug={eventSlug}
            questionId={questionId}
            orderBy={orderBy}
            className="mt-5"
        />
    ) : (
        <OpenQuestionsList
            initialQuestions={questions}
            ownerId={ownerId}
            eventSlug={eventSlug}
            questionId={questionId}
            orderBy={orderBy}
            className="mt-5"
        />
    );
};

export default QuestionsPage

