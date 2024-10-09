import {deleteQuestionAction} from "@/lib/actions/delete-question-action";
import {cn} from "@/lib/utils/ui-utils";
import {Question} from "@prisma/client";
import {AlertDialogProps} from "@radix-ui/react-alert-dialog";
import {useAction} from "next-safe-action/hooks";
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
import {buttonVariants} from "@/components/ui/button";
import {toast} from "sonner";
import React from "react";

type Props = {
    questionId: Question["id"];
    onSuccess?: () => void;
} & AlertDialogProps;

export const DeleteQuestionDialog =
    ({
         questionId, onSuccess: handleSuccess, ...dialogProps
     }: Props) => {
        const {execute, isExecuting: isFieldDisabled} = useAction(deleteQuestionAction, {
            onError: (err) => {
                console.error(err);
                toast.error("Failed to delete the question.")
            },
            onSuccess: () => {
                handleSuccess?.();
                toast.success("Your question has been deleted!")
            },
        });

        const handleDelete = async (evt: React.MouseEvent) => {
            evt.preventDefault();
            execute({questionId});
        };
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
                            {isFieldDisabled ? "Deleting..." : "Continue"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };
