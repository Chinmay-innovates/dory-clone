"use client"
import {cn, PropsWithClassName} from "@/lib/utils/ui-utils";
import {PollDetail} from "@/lib/prisma/validators/poll-validators";
import {Event, Poll, User} from "@prisma/client";
import {useCallback, useState} from "react";
import {NoContent} from "@/components/illustrations";
import {useAction} from "next-safe-action/hooks";
import {getEventClosedPollsAction} from "@/lib/actions/get-event-closed-polls-action";
import {useSearchParams} from "next/navigation";
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {InfiniteScrollList} from "@/components/infinite-scroll-list";
import {ClosedPoll} from "@/components/poll";

type Props = PropsWithClassName<{
    initialPolls: PollDetail[];
    ownerId: User["id"];
    eventSlug: Event["slug"];
    pollId?: Poll["id"];
}>;

export const ClosedPollsList = ({eventSlug, ownerId, initialPolls, className, pollId,}: Props) => {
    const [closedPolls, setClosedPolls] = useState(initialPolls);
    const {executeAsync} = useAction(getEventClosedPollsAction)
    const searchParams = useSearchParams();
    const fetchMoreClosedPolls = useCallback(
        async ({cursor}: { cursor?: QuestionDetail["id"] }) => {
            const newQuestions = await executeAsync({
                cursor,
                eventSlug,
                ownerId,
                pollId,
            });

            if (!newQuestions?.data || newQuestions.data.length === 0) {
                return [];
            }

            return newQuestions.data;
        },
        [executeAsync, eventSlug, ownerId, pollId]
    );

    return (
        <div className={cn("space-y-8 pb-10", className)}>
            {closedPolls.length === 0 ? (
                <NoContent>
          <span className="tracking-tight font-light mt-3">
            No polls has been completed yet!
          </span>
                </NoContent>
            ) : (
                <InfiniteScrollList<PollDetail>
                    key={`closed-polls-${searchParams.toString()}`}
                    items={closedPolls}
                    setItems={setClosedPolls}
                    renderItem={(poll) =>
                        //@ts-ignore
                        <ClosedPoll key={poll.id} poll={poll}/>
                    }
                    fetchMore={fetchMoreClosedPolls}
                />
            )}
        </div>
    );
}