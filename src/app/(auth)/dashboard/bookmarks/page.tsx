import {ScrollArea} from "@/components/ui/scroll-area";
import {NoContent} from "@/components/illustrations";
import {getUserBookmarkedEvents} from "@/lib/server/get-user-bookmarked-events";
import {BookMarkedEventsList} from "@/components/events-list";

export default async function MyBookMarksPage() {
    const initialBookmarkedEvents = await getUserBookmarkedEvents();
    return (
        <ScrollArea className="w-full h-full px-4 py-2">
            <h2 className="text-2xl font-bold mb-8 mt-4 ml-4">Bookmarked Events</h2>

            <div className="relative h-full grid gap-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {initialBookmarkedEvents.length === 0 ? (
                    <NoContent>You haven&apos;t bookmarked any events yet.</NoContent>
                ) : (
                    <BookMarkedEventsList initialEvents={initialBookmarkedEvents}/>
                )}
            </div>
        </ScrollArea>

    );
}
