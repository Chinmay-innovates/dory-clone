"use client";

import {questionsPageQueryParams} from "@/config/query-params";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {match} from "ts-pattern";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {QuestionsOrderBy} from "@/lib/utils/question-utils";

type Props = {
    sortBy: QuestionsOrderBy;
};

export const QuestionsSortBySelect = ({sortBy}: Props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const handleValueChange = (value: QuestionsOrderBy) => {
        const urlSearchParams = new URLSearchParams(searchParams);

        const orderBy = match(value)
            .returnType<QuestionsOrderBy | undefined>()
            .with("most-popular", () => "most-popular")
            .with("newest", () => "newest")
            .with("oldest", () => "oldest")
            .otherwise(() => undefined);

        orderBy
            ? urlSearchParams.set(questionsPageQueryParams.sortBy, orderBy)
            : urlSearchParams.delete(questionsPageQueryParams.sortBy);

        router.replace(`${pathname}?${urlSearchParams.toString()}`);
    };

    return (
        <Select
            key={`${pathname}${searchParams.toString()}`}
            defaultValue={sortBy}
            onValueChange={handleValueChange}
        >
            <SelectTrigger className="text-xs bg-white lg:text-sm">
                <SelectValue/>
            </SelectTrigger>

            <SelectContent>
                <SelectItem value={"most-popular" as QuestionsOrderBy}>
                    Most Popular
                </SelectItem>
                <SelectItem value={"newest" as QuestionsOrderBy}>Newest</SelectItem>
                <SelectItem value={"oldest" as QuestionsOrderBy}>Oldest</SelectItem>
            </SelectContent>
        </Select>
    );
};
