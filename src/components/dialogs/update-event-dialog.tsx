"use client";

import {EventDetail} from "@/lib/prisma/validators/event-validators";
import {DialogProps} from "@radix-ui/react-dialog";
import {Dialog, DialogContent, DialogTitle} from "../ui/dialog";

type Props = { event: EventDetail; onSuccess?: () => void } & DialogProps;

export const UpdateEventDialog = ({event, onSuccess: handleSuccess, ...props}: Props) => {
    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogTitle>Update Event</DialogTitle>
                Form
                {/*<UpdateEventForm onSuccess={handleSuccess} event={event} />*/}
            </DialogContent>
        </Dialog>
    );
};