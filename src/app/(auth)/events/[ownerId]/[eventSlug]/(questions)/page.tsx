import {QuestionsTabNavigation} from "@/components/layout/questions-tab-navigation";
import {RefreshButton} from "@/components/buttons/refresh-button";
import {QuestionsSortBySelect} from "@/components/selects/question-sort-by-select";
import {QuestionsOrderBy} from "@/lib/utils/question-utils";
import {ClearSearchParamsButton} from "@/components/buttons/clear-search-params-button";

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

        {/* Filter*/}
        {hasFilters && (
            <div className="flex mt-4 items-center">
                <p className="">You have active filters!</p>
                <ClearSearchParamsButton/>
            </div>
        )}
    </>
}
export default QuestionsPage