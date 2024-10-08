"use client"

import {cn, PropsWithClassName} from "@/lib/utils/ui-utils";
import {Question, Event} from "@prisma/client";
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {RegisterLink, useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {ThumbsUp} from "lucide-react";
import {useVote} from "@/hooks/use-question";

type  Props = PropsWithClassName<{
    questionId: Question["id"],
    eventSlug: Event["slug"],
    ownerId: Event["ownerId"],
    upVotes: QuestionDetail["upVotes"],
    totalVotes: number,
    isResolved: boolean,
}>

export const QuestionVoteButton = ({
                                       totalVotes: initialTotalVotes,
                                       ownerId,
                                       questionId,
                                       isResolved,
                                       upVotes,
                                       eventSlug,
                                       className
                                   }: Props) => {
    const {user} = useKindeBrowserClient();

    const {totalVotes, handleVote, isUpvote} = useVote({upVotes, questionId, totalVotes: initialTotalVotes})

    if (!user) {
        return (
            <RegisterLink>
                <button className={cn("flex flex-col items-center", className)}>
                    <ThumbsUp size={24}/>
                    <span className="px-2 pt-1 text-sm">{totalVotes}</span>
                </button>
            </RegisterLink>
        );
    }
    return <button
        onClick={handleVote}
        className={cn(
            "flex flex-col items-center disabled:cursor-not-allowed disabled:opacity-80",
            className
        )}
        disabled={isResolved}
    >
        <ThumbsUp className={cn(isUpvote && "stroke-blue-500 fill-blue-400/20")}/>
        <span className={cn("px-2 pt-1 text-sm", isUpvote && "text-blue-500")}>
        {totalVotes}
      </span>
    </button>
}