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
import {toast} from "sonner";
import {deletePollAction} from "@/lib/actions/delete-poll-action";

type Props = {
    pollId: Poll["id"];
    onSuccess?: () => void;
} & AlertDialogProps;

export const DeletePollDialog =
    ({
         pollId, onSuccess: handleSuccess, ...dialogProps
     }: Props) => {

        const {execute, isExecuting: isFieldDisabled} = useAction(deletePollAction, {
            onSuccess: () => {
                handleSuccess?.()
                toast.success("Your poll has been deleted successfully", {
                    duration: 3000
                })
            },
            onError: (err) => {
                console.error(err);

                toast.error("Failed to delete poll")
            }
        })

        const handleDelete = (evt: React.MouseEvent) => {
            evt.preventDefault();
            execute({pollId});
        };


        return (
            <AlertDialog {...dialogProps}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your poll
                            adn all its votes from the event.
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
                            {isFieldDisabled ? "Deleting..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };
