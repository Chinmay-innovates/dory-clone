"use client";

import React, {useState} from "react";
import {Dialog, DialogContent, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {CreateEventForm} from "@/components/forms/create-event-form";

type Props = { children: React.ReactNode };

export const NewEventDialog = ({children}: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogTitle>New Event</DialogTitle>

                <CreateEventForm onSuccess={() => setOpen(false)}/>
            </DialogContent>
        </Dialog>
    );
};
