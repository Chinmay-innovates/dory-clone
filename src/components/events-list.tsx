import {EventDetail} from "@/lib/prisma/validators/event-validators";
import {EventCard} from "@/components/event-card";

type  Props = {
    initialEvents: EventDetail[]
}
export const EventsList = ({initialEvents}: Props) => {
    return initialEvents.map((event) => (
        <EventCard key={event.id} event={event} className="h-36" />
    ))
}