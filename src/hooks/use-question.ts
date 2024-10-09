import {Question} from "@prisma/client";
import {useCallback, useEffect, useRef, useState} from "react";
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import debounce from "lodash.debounce";
import {useAction} from "next-safe-action/hooks";
import {updateQuestionAction} from "@/lib/actions/update-question-action";
import {toast} from "sonner";
import {voteQuestionAction} from "@/lib/actions/vote-question-action";

export const useTogglePin = ({isPinned: initialIsPinned, questionId}: {
    questionId: Question["id"],
    isPinned: boolean,
}) => {
    const [isPinned, setIsPinned] = useState(initialIsPinned);
    const {execute, isExecuting} = useAction(updateQuestionAction, {
        onSuccess: () => console.log("Question Pinned"),
        onError: (error) => {
            console.error(error)
            toast.error("Failed to pin question");

            //     revert the optimistic update
            setIsPinned((prevIsPinned) => !prevIsPinned)
        }
    })

    const togglePin = () => {
        // optimistic update (client)
        setIsPinned((prevState) => !prevState);
        execute({questionId, isPinned: !isPinned})
    };
    return {isPinned, togglePin, isExecuting}
}

export const useToggleResolved = ({isResolved: initialIsResolved, questionId}: {
    questionId: Question["id"],
    isResolved: boolean,
}) => {
    const [isResolved, setIsResolved] = useState(initialIsResolved);
    const {execute, isExecuting} = useAction(updateQuestionAction, {
        onSuccess: () => console.log("Question Resolved"),
        onError: (error) => {
            console.error(error)
            toast.error("Failed to resolve question");

            //     revert the optimistic update
            setIsResolved((prevIsResolved) => !prevIsResolved)
        }
    })

    const toggleResolve = () => {
        // optimistic update (client)
        setIsResolved((prevState) => !prevState);
        execute({questionId, isResolved: !isResolved})
    };
    return {isResolved, toggleResolve, isExecuting}
}

export const useVote = ({totalVotes: initialTotalVotes, upVotes, questionId}: {
    questionId: Question["id"],
    upVotes: QuestionDetail["upVotes"],
    totalVotes: number
}) => {
    const {user} = useKindeBrowserClient();

    const [{isUpvote, totalVotes}, setClientState] = useState({
        isUpvote: upVotes.some((upvote) => upvote.authorId === user?.id),
        totalVotes: initialTotalVotes,
    });
    const {execute} = useAction(voteQuestionAction, {
        onError: (error) => {
            console.error(error)
            // revert the optimistic
            toggleClientVote()
        },
        onSuccess: () => console.log("Question Voted")
    })

    // To avoid stale client data
    useEffect(() => {
        setClientState((prevState) => ({
            ...prevState,
            isUpvote: upVotes.some((upvote) => upvote.authorId === user?.id),
        }));
    }, [upVotes, user])

    const toggleClientVote = () => {
        setClientState((prevState) => ({
            isUpvote: !prevState.isUpvote,
            totalVotes: prevState.isUpvote ? prevState.totalVotes - 1 : prevState.totalVotes + 1,
        }));
    }

    const handleVote = () => {
        // optimistic update (client)
        toggleClientVote()
        performVote()
    }

    const performVote = useCallback(
        debounce(
            () => {
                execute({questionId})
            }, 1000, {trailing: true, leading: false}
        ),
        [questionId]
    );

    return {isUpvote, totalVotes, handleVote}
}

export const useUpdateQuestionBody = ({questionId, body: initialBody,}: {
    questionId: Question["id"];
    body: Question["body"];
}) => {
    const lastValidBody = useRef(initialBody);
    const {execute, isExecuting} = useAction(updateQuestionAction, {
        onSuccess: ({input}) => {
            console.log("Question Body Updated")
            lastValidBody.current = input.body!
        },
        onError: (error) => {
            console.error(error)
            toast.error("Failed to update question body");

            //     revert the optimistic update
            setBody(lastValidBody.current)
        }
    })
    const [body, setBody] = useState(initialBody);

    const updateBody = (newBody: string) => {
        // optimistic update (client)
        setBody(newBody);
        execute({
            questionId,
            body: newBody
        })
    };

    return {body, updateBody, isExecuting};
}
