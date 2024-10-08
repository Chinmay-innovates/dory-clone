import React from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {Event, Question} from "@prisma/client";
import {AlertDialogProps} from "@radix-ui/react-alert-dialog";
import {cn} from "@/lib/utils/ui-utils";
import {buttonVariants} from "@/components/ui/button";

type Props = {
    questionId: Question["id"];
    onSuccess?: () => void;
} & AlertDialogProps;

export const DeleteQuestionDialog = ({questionId, onSuccess: handleSuccess, ...dialogProps}: Props) => {


    const handleDelete = (evt: React.MouseEvent) => {
        evt.preventDefault();

        // execute({eventId});
    };

    const isFieldDisabled = false;

    return (
        <AlertDialog {...dialogProps}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        question from the event.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isFieldDisabled}
                        className={cn(buttonVariants({variant: "ghost"}))}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isFieldDisabled}
                        onClick={handleDelete}
                        className={cn(buttonVariants({variant: "destructive"}))}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};