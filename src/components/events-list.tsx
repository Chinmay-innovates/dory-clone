"use client"

import {Event} from "@prisma/client";
import {useCallback, useState} from "react";
import {useAction} from "next-safe-action/hooks";
import {EventCard} from "@/components/event-card";
import {InfiniteScrollList} from "@/components/infinite-scroll-list";
import {EventDetail} from "@/lib/prisma/validators/event-validators";
import {getUserEventsAction} from "@/lib/actions/get-user-events-action";
import {getUserBookmarkedEventsAction} from "@/lib/actions/get-user-bookmarked-events-action";

type  Props = {
    initialEvents: EventDetail[];
    fetchAction?: (cursor?: Event["id"]) => Promise<EventDetail[]>;
}

const EventsList = ({initialEvents, fetchAction}: Props) => {
    const [events, setEvents] = useState(initialEvents);

    const fetchMoreEvents = useCallback(
        async ({cursor}: { cursor?: Event["id"] }) => {
            const newEvents = await fetchAction?.(cursor);

            if (!newEvents || newEvents.length === 0) {
                return [];
            }

            return newEvents;
        },
        [fetchAction]
    );
    return (
        <InfiniteScrollList<EventDetail>
            items={events}
            setItems={setEvents}
            fetchMore={fetchMoreEvents}
            //@ts-ignore
            renderItem={(event) => (
                <EventCard key={event.id} event={event} className="h-36"/>
            )}
        />
    );
}

export const UserEventsList = ({initialEvents}: Props) => {
    const {executeAsync} = useAction(getUserEventsAction);

    const fetchUserEvents = async (cursor?: Event["id"]) => {
        const newEvents = await executeAsync({cursor});
        return newEvents?.data || [];
    };

    return (
        <EventsList
            initialEvents={initialEvents}
            fetchAction={fetchUserEvents}
        />
    );
};
export const BookMarkedEventsList = ({initialEvents}: Props) => {
    const {executeAsync} = useAction(getUserBookmarkedEventsAction);

    const fetchUserEvents = async (cursor?: Event["id"]) => {
        const newEvents = await executeAsync({cursor});
        return newEvents?.data || [];
    };

    return (
        <EventsList
            initialEvents={initialEvents}
            fetchAction={fetchUserEvents}
        />
    );
}