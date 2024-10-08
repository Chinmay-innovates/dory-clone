import Link from "next/link";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {cn, PropsWithClassName} from "@/lib/utils/ui-utils";
import {EventDetail} from "@/lib/prisma/validators/event-validators";
import {Users} from "lucide-react";
import routes from "@/config/routes";

type Props = PropsWithClassName<{
    event: EventDetail;
}>

export const EventCard = ({event, className}: Props) => {

    const questionsCount = event._count.questions;
    const pollsCount = event._count.polls;
    const participantsCount = event._count.participants;

    return <Link href={routes.event({
        ownerId: event.ownerId,
        eventSlug: event.slug,
    })} prefetch={false}>
        <Card
            className={cn("rounded-none border-l-[4px] border-b-0 border-t-0 border-r-0 border-gray-400/80", className)}>
            <CardHeader>
                <div className="flex justify-between">
                    <h4 className="text-base font-semibold line-clamp-2">
                        {event.displayName}
                    </h4>
                </div>
                <div className="flex justify-between text-[12px] text-gray-400 font-medium">
                    <span>
                        <span>Q&A: {questionsCount}</span>
                        <span className="mx-2">&bull;</span>
                        <span>polls: {pollsCount}</span>
                    </span>
                    <span className="inline-flex gap-x-1 items-center font-bold">
                        <Users className="size-3.5"/>
                        <span>{participantsCount} participants</span>
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-gray-400 text-xs line-clamp-2">
                    {event.shortDescription}
                </p>
            </CardContent>
        </Card>
    </Link>
}