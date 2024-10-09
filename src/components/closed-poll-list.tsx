"use client"
import {cn, PropsWithClassName} from "@/lib/utils/ui-utils";
import {PollDetail} from "@/lib/prisma/validators/poll-validators";
import {Event, Poll, User} from "@prisma/client";
import {useState} from "react";
import {NoContent} from "@/components/illustrations";
import {ClosedPoll} from "@/components/poll";

type Props = PropsWithClassName<{
    initialPolls: PollDetail[];
    ownerId: User["id"];
    eventSlug: Event["slug"];
    pollId?: Poll["id"];
}>;

export const ClosedPollsList = ({eventSlug, ownerId, initialPolls, className, pollId,}: Props) => {
    const [closedPolls, setClosedPolls] = useState(initialPolls);
    return (
        <div className={cn("space-y-8 pb-10", className)}>
            {closedPolls.length === 0 ? (
                <NoContent>
          <span className="tracking-tight font-light mt-3">
            No polls has been completed yet!
          </span>
                </NoContent>
            ) : (
                closedPolls.map(poll => <   ClosedPoll key={poll.id} poll={poll}/>)
            )}
        </div>
    );
}