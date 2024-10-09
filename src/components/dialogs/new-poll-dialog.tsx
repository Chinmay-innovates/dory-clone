"use client";

import {Event} from "@prisma/client";
import React, {useState} from "react";
import {Dialog, DialogContent, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {CreatePollForm} from "@/components/forms/create-poll-form";

type Props = {
    children: React.ReactNode;
    eventId: Event["id"];
};

export const NewPollDialog = ({eventId, children}: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogTitle>New Poll</DialogTitle>

                <CreatePollForm eventId={eventId} onSuccess={() => setOpen(false)}/>
            </DialogContent>
        </Dialog>
    );
};
