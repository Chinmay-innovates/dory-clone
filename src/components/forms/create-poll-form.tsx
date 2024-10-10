import {toast} from "sonner";
import {zodResolver} from "@hookform/resolvers/zod";
import {Event} from "@prisma/client";
import {Plus, Trash} from "lucide-react";
import {useAction} from "next-safe-action/hooks";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {createLivePollSchema, CreateLivePollSchema} from "@/lib/schema-validations/poll-schemas";
import {createLivePollAction} from "@/lib/actions/create-live-poll";
import {TextAreaWithCounter} from "@/components/textarea-with-counter";
import {poll} from "@/lib/schema-validations/constants";
import {Input} from "@/components/ui/input";

type Props = {
    eventId: Event["id"];
    onSuccess?: () => void;
};

export const CreatePollForm = ({eventId, onSuccess: handleSuccess,}: Props) => {
    const form = useForm<CreateLivePollSchema>({
        resolver: zodResolver(createLivePollSchema),
        defaultValues: {
            body: "",
            options: ["option 1", "option 2"],
            eventId,
        },
        mode: "onSubmit",
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        // @ts-ignore
        name: "options",
    });

    const {execute, isExecuting} = useAction(createLivePollAction, {
        onError: (err) => {
            console.error(err);
            toast.error(`Failed to create the poll. ${err.error.serverError}`)
        },
        onSuccess: () => {
            handleSuccess?.();
            toast.success("Your poll has been created!")
        },
        onSettled: () => form.reset(),
    });

    const onSubmit = async (values: CreateLivePollSchema) => execute(values);

    const isFieldDisabled = form.formState.isSubmitting || isExecuting;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="body"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Question</FormLabel>

                            <FormControl>
                                <TextAreaWithCounter
                                    disabled={isFieldDisabled}
                                    placeholder="e.g. What is your favorite color?"
                                    maxLength={poll.body.maxLength}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className="err-msg">
                                {form.formState.errors.body?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                <div role="list" className="mt-8 space-y-4">
                    <FormLabel className="block">
                        Options (max {poll.options.maxCount})
                    </FormLabel>

                    <FormMessage className="err-msg">
                        {form.formState.errors.options?.root?.message}
                    </FormMessage>

                    {fields.map((field, index) => (
                        <FormField
                            key={field.id}
                            name={`options.${index}`}
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex gap-x-2 items-center">
                                            <span className="grow-0">{index + 1}.</span>

                                            <Input
                                                placeholder="e.g. Blue"
                                                maxLength={poll.options.maxLength}
                                                {...field}
                                            />

                                            <Button
                                                size={"sm"}
                                                type="button"
                                                variant={"outline"}
                                                disabled={isFieldDisabled}
                                                onClick={() => remove(index)}
                                            >
                                                <Trash size={12}/>
                                            </Button>
                                        </div>
                                    </FormControl>

                                    <FormMessage className="err-msg">
                                        {form.formState.errors.options?.[index]?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button
                        type="button"
                        variant={"outline"}
                        size={"sm"}
                        disabled={isFieldDisabled || fields.length >= poll.options.maxCount}
                        className="mt-4"
                        onClick={() => append(`option ${fields.length + 1}`)}
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Add option
                    </Button>
                </div>

                <Button
                    disabled={isFieldDisabled}
                    type="submit"
                    className="w-full mt-10"
                >
                    {isExecuting ? "Launching poll..." : "Launch Poll"}
                </Button>
            </form>
        </FormProvider>
    );
};
