import {Question} from "@prisma/client";
import {useCallback, useEffect, useRef, useState} from "react";
import {QuestionDetail} from "@/lib/prisma/validators/question-validator";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import debounce from "lodash.debounce";

export const useTogglePin = ({isPinned: initialIsPinned, questionId}: {
    questionId: Question["id"],
    isPinned: boolean,
}) => {
    const [isPinned, setIsPinned] = useState(initialIsPinned);

    const togglePin = () => {
        // optimistic update (client)
        setIsPinned((prevState) => !prevState);
    };
    return {isPinned, togglePin}
}

export const useToggleResolved = ({isResolved: initialIsResolved, questionId}: {
    questionId: Question["id"],
    isResolved: boolean,
}) => {
    const [isResolved, setIsResolved] = useState(initialIsResolved);

    const toggleResolve = () => {
        // optimistic update (client)
        setIsResolved((prevState) => !prevState);
    };
    return {isResolved, toggleResolve}
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
                console.log("up vote")
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
    const [body, setBody] = useState(initialBody);

    const updateBody = (newBody: string) => {
        // optimistic update (client)
        setBody(newBody);
    };

    return {body, updateBody};
}
