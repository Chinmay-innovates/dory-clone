"use client";

import {EventDetail} from "@/lib/prisma/validators/event-validators";
import {DialogProps} from "@radix-ui/react-dialog";
import {UpdateEventForm} from "@/components/forms/update-event-form";
import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";

type Props = { event: EventDetail; onSuccess?: () => void } & DialogProps;

export const UpdateEventDialog = ({event, onSuccess: handleSuccess, ...props}: Props) => {
    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogTitle>Update Event</DialogTitle>
                <UpdateEventForm onSuccess={handleSuccess} event={event}/>
            </DialogContent>
        </Dialog>
    );
};