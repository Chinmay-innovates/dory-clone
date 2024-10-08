"use client"
import {EventDetail} from "@/lib/prisma/validators/event-validators";
import {useCallback, useEffect, useState} from "react";
import {RegisterLink, useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {Button} from "@/components/ui/button";
import {Bookmark, BookmarkCheck} from "lucide-react";
import routes, {baseUrl} from "@/config/routes";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import {toast} from "sonner";
import debounce from "lodash.debounce"
import {useIsParticipantView} from "@/hooks/use-is-participant-view";
import {useAction} from "next-safe-action/hooks";
import {bookmarkEventAction} from "@/lib/actions/bookmark-event-action";

type Props = {
    event: EventDetail;
};

export const BookmarkEventButton = ({event}: Props) => {
    const {user} = useKindeBrowserClient();

    const isParticipantView = useIsParticipantView();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const {execute} = useAction(bookmarkEventAction, {
        onError: (err) => {
            console.error(err)
            toggleClientBookmark()
        },
        onSuccess: () => {
            console.log("success bookmark event action")
        }
    })


    const handleBookmark = () => {
        // optimistic update
        toggleClientBookmark();

        performBookmark();
    };

    const toggleClientBookmark = () => {
        const wasBookmarked = isBookmarked;

        setIsBookmarked((prev) => !prev);

        toast.success(
            wasBookmarked
                ? "Event removed from bookmarks!"
                : "Event added to bookmarks!",
        );
    };

    const performBookmark = useCallback(() => {
        const debouncedExecute = debounce(() => {
            execute({eventId: event.id});
        }, 1000, {leading: false, trailing: true});

        debouncedExecute();
    }, [event.id, execute]);

    useEffect(() => {
        setIsBookmarked(
            event.bookmarkedBy.some((bookmarkUser) => bookmarkUser.id === user?.id)
        );
    }, [event.bookmarkedBy, user?.id]);


    if (isParticipantView) {
        return null;
    }

    if (!user) {
        return (
            <RegisterLink
                postLoginRedirectURL={`${baseUrl}${routes.event({
                    ownerId: event.ownerId,
                    eventSlug: event.slug
                })}`}
            >
                <Button variant={"outline"} className="rounded-full">
                    <Bookmark className="w-4 h-4"/>
                </Button>
            </RegisterLink>
        );
    }
    return (
        <TooltipProvider>
            <Tooltip delayDuration={60}>
                <TooltipTrigger asChild>
                    <Button
                        onClick={handleBookmark}
                        variant="outline"
                        className="rounded-full"
                    >
                        {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4"/>
                        ) : (
                            <Bookmark className="w-4 h-4"/>
                        )}
                    </Button>
                </TooltipTrigger>

                <TooltipContent className="bg-black text-white text-sm" align="center" side="top" sideOffset={10}>
                    {isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

}