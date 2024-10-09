"use client"
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {useRef, useState} from "react";
import {cn} from "@/lib/utils/ui-utils";
import {UserAvatar} from "@/components/user-avatar";
import {defaultDateFormatter} from "@/lib/utils/date-utils";
import {CheckCircle, Pin} from "lucide-react";
import {QuestionVoteButton} from "@/components/buttons/question-vote-button";
import {QuestionOptionsMenu} from "@/components/menu/question-options-menu";
import {useTogglePin, useToggleResolved, useUpdateQuestionBody} from "@/hooks/use-question";
import {Button} from "@/components/ui/button";
import {TextAreaWithCounter} from "@/components/textarea-with-counter";
import {question as questionValidator} from "@/lib/schema-validations/constants";
import {questionBodySchema} from "@/lib/schema-validations/question-schemas";

type Props = {
    question: QuestionDetail;
};

export const Question = ({question}: Props) => {
    const {user} = useKindeBrowserClient();


    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);


    const {isPinned, togglePin} = useTogglePin({
        questionId: question.id,
        isPinned: question.isPinned
    })

    const {isResolved, toggleResolve} = useToggleResolved({
        questionId: question.id,
        isResolved: question.isResolved
    })

    const {body, updateBody, isExecuting: isUpdatingBody} = useUpdateQuestionBody({
        questionId: question.id,
        body: question.body
    })

    const {author, createdAt} = question;
    const isAuthor = author.id === user?.id;
    const isAdmin = question.event.ownerId === user?.id;

    const handleBodyChange = () => {
        const rawBodyValue = textareaRef.current?.value;
        const parsedBody = questionBodySchema.safeParse(rawBodyValue);
        if (parsedBody.success) {
            const newBody = parsedBody.data;
            setIsEditing(false);
            updateBody(newBody);
        }
    }

    return <div className={cn(
        "border rounded-xl drop-shadow-md bg-white p-4 lg:p-6",
        isResolved && "border-green-400 bg-green-50"
    )}>
        <div className="flex items-center gap-x-5">
            {/* Vote button */}
            {!isEditing && (
                <QuestionVoteButton questionId={question.id} eventSlug={question.event.slug}
                                    ownerId={question.event.ownerId}
                                    upVotes={question.upVotes} totalVotes={question._count.upVotes}
                                    isResolved={isResolved}/>
            )}
            <div className="flex-1 grow-1">
                <div className="flex items-center gap-x-2">
                    <span className="inline-flex items-center gap-x-2">
                        <UserAvatar
                            className="size-8"
                            displayName={author.displayName}
                            color={author.color}
                        />
                        <span className="text-sm text-slate-600">
                            {author.displayName}
                        </span>
                    </span>
                    <time className="text-slate-400  text-xs">
                        {defaultDateFormatter.format(createdAt)}
                    </time>
                    {isPinned && (
                        <Pin
                            size={20}
                            className="inline-block ml-2 fill-blue-400 -rotate-45 size-4 absolute top top-[12px] left-[32px]"
                        />
                    )}

                    {isResolved ? (
                        <CheckCircle className="stroke-green-500" size={20}/>
                    ) : (
                        <QuestionOptionsMenu
                            questionId={question.id}
                            isResolved={isResolved}
                            isEditing={isEditing}
                            isPinned={isPinned}
                            isAuthor={isAuthor}
                            isAdmin={isAdmin}
                            toggleEditingMode={() => setIsEditing(true)}
                            onPinChange={togglePin}
                            onResolveChange={toggleResolve}
                            className="text-slate-600 ml-auto"
                        />
                    )}

                </div>
                {/* Question body or Editor */}
                {isEditing ? (
                    <form
                        onSubmit={(evt) => {
                            evt.preventDefault();
                            handleBodyChange();
                        }}
                    >
                        <TextAreaWithCounter
                            ref={textareaRef}
                            className="mt-3 min-h-24"
                            defaultValue={body}
                            maxLength={questionValidator.maxLength}
                            autoFocus
                        />

                        <div className="flex gap-x-2 -mt-2 justify-end">
                            <Button onClick={() => setIsEditing(false)} variant="ghost">
                                Cancel
                            </Button>

                            <Button disabled={isUpdatingBody} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="mt-5 ml-3 whitespace-pre-wrap text-sm">{body}</p>
                )}

            </div>
        </div>
    </div>
}