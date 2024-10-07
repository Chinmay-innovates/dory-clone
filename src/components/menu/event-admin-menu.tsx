"use client"
import {useState} from "react";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent} from "@/components/ui/dropdown-menu";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {PropsWithClassName, cn} from "@/lib/utils/ui-utils";
import {EventDetail} from "@/lib/prisma/validators/event-validators";
import {Button} from "@/components/ui/button";
import {Edit, Settings, Trash} from "lucide-react";
import {DeleteEventDialog} from "@/components/dialogs/delete-event-dialog";
import {UpdateEventDialog} from "@/components/dialogs/update-event-dialog";


type Props = PropsWithClassName<{
    event: EventDetail;
}>;

export const EventAdminMenu = ({event, className}: Props) => {
    const {user} = useKindeBrowserClient();

    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const isAdmin = event.ownerId === user?.id;
    const isParticipantView = false;

    if (isParticipantView || !isAdmin) {
        return null;
    }

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button className="rounded-full text-black" variant="outline">
                        <Settings className={cn("w-4 h-4", className)}/>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="p-2 space-y-1">
                    <DropdownMenuItem
                        className="text-sm"
                        onSelect={() => setOpenUpdateDialog(true)}
                    >
                        <Edit className="w-4 h-4 mr-2"/>
                        <span>Edit event</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-sm text-destructive"
                        onSelect={() => setOpenDeleteDialog(true)}
                    >
                        <Trash className="w-4 h-4 mr-2"/>
                        <span>Delete event</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialogs*/}
            <UpdateEventDialog
                open={openUpdateDialog}
                onOpenChange={setOpenUpdateDialog}
                event={event}
                onSuccess={() => setOpenUpdateDialog(false)}
            />

            <DeleteEventDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                eventId={event.id}
            />
        </>
    );
};