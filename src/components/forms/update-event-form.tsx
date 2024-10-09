"use client";

import {updateEventAction} from "@/lib/actions/update-event-action";
import {EventDetail} from "@/lib/prisma/validators/event-validators";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAction} from "next-safe-action/hooks";
import {FormProvider, useForm} from "react-hook-form";
import {toast} from "sonner";
import {updateEventSchema, UpdateEventSchema} from "@/lib/schema-validations/event-schemas";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {TextAreaWithCounter} from "@/components/textarea-with-counter";
import {event as eventValidation} from "@/lib/schema-validations/constants";
import {Button} from "@/components/ui/button";

type Props = {
    event: EventDetail;
    onSuccess?: () => void;
};

export const UpdateEventForm = ({event, onSuccess: handleSuccess}: Props) => {
    const form = useForm<UpdateEventSchema>({
        resolver: zodResolver(updateEventSchema),
        defaultValues: {
            eventId: event.id,
            shortDescription: event.shortDescription ?? undefined,
        },
        mode: "onSubmit",
    });

    const {execute, isExecuting} = useAction(updateEventAction, {
        onError: () => {
            toast.error("Failed to update the event!")
        },
        onSuccess: () => {
            handleSuccess?.();

            toast.success("Your event has been updated");
        },
        onSettled: () => form.reset(),
    });

    const isFieldDisabled = form.formState.isSubmitting || isExecuting;

    const onSubmit = async (values: UpdateEventSchema) => execute(values);

    return (
        <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormItem>
                    <FormLabel>Event Name</FormLabel>

                    <Input type="text" value={event.displayName} disabled/>
                </FormItem>

                <FormField
                    name="shortDescription"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Event Description</FormLabel>

                            <FormControl>
                                <TextAreaWithCounter
                                    disabled={isFieldDisabled}
                                    placeholder="What is your event about?"
                                    maxLength={eventValidation.shortDescription.maxLength}
                                    defaultValue={event.shortDescription ?? ""}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className="error-msg">
                                {form.formState.errors.shortDescription?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full mt-10"
                    disabled={isFieldDisabled}
                >
                    {isExecuting ? "Updating event..." : "Update Event"}
                </Button>
            </form>
        </FormProvider>
    );
};
