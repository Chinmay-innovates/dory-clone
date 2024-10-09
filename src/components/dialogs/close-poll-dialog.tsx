import {cn} from "@/lib/utils/ui-utils";
import {Poll} from "@prisma/client";
import {AlertDialogProps} from "@radix-ui/react-alert-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import {buttonVariants} from "../ui/button";
import React from "react";
import {useAction} from "next-safe-action/hooks";
import {closePollAction} from "@/lib/actions/close-poll-action";
import {toast} from "sonner";

type Props = {
    pollId: Poll["id"];
    onSuccess?: () => void;
} & AlertDialogProps;

export const ClosePollDialog =
    ({pollId, onSuccess: handleSuccess, ...dialogProps}: Props) => {

        const {execute, isExecuting: isFieldDisabled} = useAction(closePollAction, {
            onError: (err) => {
                console.error(err);
                toast.error("Failed to close the poll. Please try again later")
            },
            onSuccess: () => {
                handleSuccess?.();
                toast.success("Your poll has been successfully closed");
            }
        })

        const handleClose = (evt: React.MouseEvent) => {
            evt.preventDefault();

            execute({pollId});
        };


        return (
            <AlertDialog {...dialogProps}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The poll cannot be reopened afterwards
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
                            onClick={handleClose}
                            className={cn(buttonVariants({variant: "destructive"}))}
                        >
                            {isFieldDisabled ? "Closing..." : "Close"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };
