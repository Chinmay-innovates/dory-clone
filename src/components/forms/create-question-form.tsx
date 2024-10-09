import {Event, User} from "@prisma/client";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormProvider, useForm} from "react-hook-form";
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {CreateQuestionSchema, createQuestionSchema} from "@/lib/schema-validations/question-schemas";

import {toast} from "sonner";
import {ChatBubbleIcon} from "@radix-ui/react-icons";
import {Button, buttonVariants} from "@/components/ui/button";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {RegisterLink, useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {TextAreaWithCounter} from "@/components/textarea-with-counter";

import {cn} from "@/lib/utils/ui-utils";
import {createQuestionAction} from "@/lib/actions/create-question-action";
import {useAction} from "next-safe-action/hooks";

type Props = {
    ownerId: User["id"];
    eventSlug: Event["slug"];
    onSuccess: (data: QuestionDetail) => void;
};
export const CreateQuestionForm = ({ownerId, eventSlug, onSuccess: handleSuccess}: Props) => {
    const {isAuthenticated} = useKindeBrowserClient();
    const form = useForm<CreateQuestionSchema>({
        resolver: zodResolver(createQuestionSchema),
        defaultValues: {
            body: "",
            eventSlug,
            ownerId,
        },
        mode: "onSubmit"
    })
    const {execute, isExecuting} = useAction(createQuestionAction, {
        onSuccess: ({data}) => {
            if (data) {
                handleSuccess(data);
            }
            toast.success("Your question has been posted!")
        },
        onError: () => {
            toast.error("Failed to post your question. Please retry.")
        },
        onSettled: () => form.reset(),
    });

    const isFieldDisabled = form.formState.isSubmitting || isExecuting;

    const onSubmit = async (values: CreateQuestionSchema) => execute(values)

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                  className="py-2 px-3 border border-dashed border-primary/60 rounded-lg">
                <FormField
                    name="body"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Your Question</FormLabel>
                            <FormControl>
                                <TextAreaWithCounter
                                    placeholder="What do you want to ask about?"
                                    disabled={isFieldDisabled}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="err-msg">
                                {form.formState.errors.body?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end -mt-3">
                    <div className="flex justify-end">
                        {isAuthenticated ? (
                            <Button type="submit" size="lg" disabled={isFieldDisabled}>
                                <ChatBubbleIcon className="w-4 h-4 mr-2"/>

                                <span className="text-xs lg:text-sm">
                  {isExecuting ? "Posting..." : "Ask"}
                </span>
                            </Button>
                        ) : (
                            <RegisterLink
                                className={cn(
                                    buttonVariants({variant: "default", size: "lg"})
                                )}
                            >
                                <ChatBubbleIcon className="w-4 h-4 mr-2"/>

                                <span className="text-xs lg:text-sm">Ask</span>
                            </RegisterLink>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}