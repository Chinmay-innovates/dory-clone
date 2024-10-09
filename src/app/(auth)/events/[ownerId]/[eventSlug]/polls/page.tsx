import {getEventDetail} from "@/lib/server/get-event-detail";
import {notFound} from "next/navigation";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {RefreshButton} from "@/components/buttons/refresh-button";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {ClearSearchParamsButton} from "@/components/buttons/clear-search-params-button";
import {Suspense} from "react";
import {Loader} from "@/components/loader";
import {PollsTabNavigation} from "@/components/layout/polls-tab-navigation";
import {getEventLivePolls} from "@/lib/server/get-event-live-polls";
import {getEventClosedPolls} from "@/lib/server/get-event-closed-polls";
import {NoContent} from "@/components/illustrations";
import {LivePoll} from "@/components/poll";
import {ClosedPollsList} from "@/components/closed-poll-list";


type PathParams = {
    ownerId: string,
    eventSlug: string,
}
type SearchParams = {
    closed: string,
    asParticipant: string,
    pollId: string,
}
export default async function PollsPage({params: {ownerId, eventSlug}, searchParams}: {
    params: PathParams,
    searchParams?: SearchParams
}) {
    const showClosed = searchParams?.closed === "true";
    const isParticipantView = searchParams?.asParticipant === "true";
    const pollId = searchParams?.pollId;

    const event = await getEventDetail({ownerId, eventSlug})
    if (!event) return notFound();

    const user = await getKindeServerSession().getUser();
    const isAdmin = event.ownerId === user.id;

    const showNewPollButton = isAdmin && !isParticipantView && !showClosed;

    const hasFilters = !!pollId;

    return (
        <>
            <div className="flex justify-between">
                <PollsTabNavigation ownerId={ownerId} eventSlug={eventSlug}/>

                <div className="inline-flex items-baseline gap-x-3">
                    <RefreshButton/>

                    {showNewPollButton && (
                        <Button
                            variant={"ghost"}
                            className="bg-blue-100 text-primary hover:bg-blue-200 hover:text-primary"
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            <span>New</span>
                            <span className="hidden lg:inline">Poll</span>
                        </Button>
                    )}
                </div>
            </div>

            {hasFilters && (
                <div className="flex mt-4 items-center gap-x-2">
                    <p className="text-muted-foreground text-sm">
                        You have active filters:
                    </p>

                    <ClearSearchParamsButton/>
                </div>
            )}

            {/* List of polls */}
            <Suspense key={Date.now()} fallback={<Loader/>}>
                <Polls
                    showClosed={showClosed}
                    eventSlug={eventSlug}
                    ownerId={ownerId}
                    pollId={pollId}
                />
            </Suspense>
        </>
    )
}

const Polls = async ({eventSlug, ownerId, showClosed = false, pollId}: {
    ownerId: string;
    eventSlug: string;
    showClosed?: boolean;
    pollId?: string;
}) => {
    const fetchPolls = showClosed ? getEventClosedPolls : getEventLivePolls;

    const polls = await fetchPolls({
        ownerId,
        eventSlug,
        ...(pollId ? {filters: {pollId}} : {}),
    });

    if (showClosed) {
        return (
            <ClosedPollsList
                initialPolls={polls}
                pollId={pollId}
                ownerId={ownerId}
                eventSlug={eventSlug}
                className="mt-5"
            />
        );
    }

    if (polls.length === 0) {
        return (
            <NoContent className="mt-10">
        <span className="tracking-tight font-light mt-3">
          No active polls right now!
        </span>
            </NoContent>
        );
    }

    //   Rendering the live polls
    return (
        <div className="mt-8 space-y-10">
            {polls.map((poll) => (
                <LivePoll key={poll.id} poll={poll}/>
            ))}
        </div>
    )
}