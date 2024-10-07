"use client"
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {useRef, useState} from "react";
import {cn} from "@/lib/utils/ui-utils";
import {UserAvatar} from "@/components/user-avatar";
import {defaultDateFormatter} from "@/lib/utils/date-utils";
import {CheckCircle, Pin} from "lucide-react";

type Props = {
    question: QuestionDetail;
};

export const Question = ({question}: Props) => {
    const {user} = useKindeBrowserClient();


    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false);

    const {author, createdAt, isPinned, isResolved} = question;
    const isAuthor = author.id === user?.id;
    const isAdmin = question.event.ownerId === user?.id;

    return <div className={cn(
        "border rounded-xl drop-shadow-md bg-white p-4 lg:p-6",
        isResolved && "border-green-400 bg-green-50"
    )}>
        <div className="flex items-center gap-x-5">
            {/* Vote button */}
            {!isEditing && (
                <button>{question._count.upVotes}</button>
            )}
            <div className="flex-1 grow-1">
                <div className="flex items-center gap-x-2">
                    <span className="inline-flex items-center gap-x-2">
                        <UserAvatar
                            className="size-7"
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
                            className="inline-block ml-2 fill-yellow-300 -rotate-45"
                        />
                    )}

                    {isResolved && (
                        <CheckCircle className="stroke-green-500" size={20}/>
                    )}
                </div>
            </div>
        </div>
    </div>


}
