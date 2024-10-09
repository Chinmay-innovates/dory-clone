"use client";

import {createEventAction} from "@/lib/actions/create-event-action";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAction} from "next-safe-action/hooks";
import {FormProvider, useForm} from "react-hook-form";
import {createEventSchema, CreateEventSchema} from "@/lib/schema-validations/event-schemas";
import {event as eventValidation} from "@/lib/schema-validations/constants";
import {toast} from "sonner";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {TextAreaWithCounter} from "@/components/textarea-with-counter";
import {Button} from "@/components/ui/button";

type Props = {
    onSuccess?: () => void;
};

export const CreateEventForm = ({onSuccess: handleSuccess}: Props) => {
    const form = useForm<CreateEventSchema>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            title: "",
        },
        mode: "onSubmit",
    });

    const {execute, isExecuting} = useAction(createEventAction, {
        onError: () => {
            toast.error("Failed to create the event!")
        },
        onSuccess: () => {
            handleSuccess?.();
            toast.success("Your event has been created");
        },
        onSettled: () => form.reset(),
    });

    const isFieldDisabled = form.formState.isSubmitting || isExecuting;

    const onSubmit = async (values: CreateEventSchema) => execute(values);

    return (
        <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="title"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Event Name</FormLabel>

                            <FormControl>
                                <Input
                                    type="text"
                                    disabled={isFieldDisabled}
                                    placeholder="e.g. Engineering Meeting"
                                    maxLength={eventValidation.displayName.maxLength}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className="err-msg">
                                {form.formState.errors.title?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

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
                    {isExecuting ? "Creating event..." : "Create Event"}
                </Button>
            </form>
        </FormProvider>
    );
};
