import {useCallback, useEffect, useMemo, useState} from "react";
import type {LikeStatus, LikeType} from "../types/like.ts"
import {
    deleteLike,
    getCoachLikeStatus,
    getCoachLikeStatusCount,
    getPostLikeStatus,
    getPostLikeStatusCount,
    likeCoach,
    likePost
} from "../request/likes.ts";

export interface UseLikesProps {
    entityId: number
    likeType: LikeType
}

export interface UseLikesReturn {
    numLikes: number,
    numDislikes: number,
    percentLikes: number,
    percentDislikes: number,
    reaction: LikeStatus | null,
    handleReact: (liked: boolean) => Promise<void>
}

const useLikes = ({entityId, likeType}: UseLikesProps) => {
    const [numLikes, setNumLikes] = useState(0)
    const [numDislikes, setNumDislikes] = useState(0)
    const [reaction, setReaction] = useState<LikeStatus | null>(null)

    const percentLikes = useMemo(() => {
        const total = numLikes + numDislikes
        return total === 0 ? 0 : (numLikes / total) * 100
    }, [numDislikes, numLikes]);

    const percentDislikes = useMemo(() => {
        const total = numLikes + numDislikes
        return total === 0 ? 0 : (numDislikes / total) * 100
    }, [numDislikes, numLikes]);

    const likeHandlers = useMemo(() => ({
        COACH: {
            countLikes: getCoachLikeStatusCount,
            getUserStatus: getCoachLikeStatus,
            react: likeCoach
        },
        POST: {
            countLikes: getPostLikeStatusCount,
            getUserStatus: getPostLikeStatus,
            react: likePost
        }
    }), []);

    const handlers = useMemo(() => likeHandlers[likeType], [likeHandlers, likeType])

    const setLikeData = useCallback(async () => {
        const likes = await handlers.countLikes(entityId, true)
        if (likes !== null) {
            setNumLikes(likes)
        }

        const dislikes = await handlers.countLikes(entityId, false)
        if (dislikes !== null) {
            setNumDislikes(dislikes)
        }
    }, [entityId, handlers])

    useEffect(() => {
        const loadData = async () => {
            await setLikeData()

            const userReaction = await handlers.getUserStatus(entityId)
            setReaction(userReaction)
        }

        loadData().then()
    }, [entityId, handlers, setLikeData]);

    useEffect(() => {
        setLikeData().then()
    }, [reaction, setLikeData]);

    const handleUnreact = useCallback(async (status: LikeStatus) => {
        await deleteLike(status.id)
        setReaction(null)
    }, []);

    const handleReact = useCallback(async (liked: boolean) => {
        if (reaction && liked === reaction.liked) {
            await handleUnreact(reaction)
            return
        }

        await handlers.react(entityId, liked)
        const newReaction = await handlers.getUserStatus(entityId)
        setReaction(newReaction)
    }, [entityId, handleUnreact, handlers, reaction]);

    return {
        numLikes,
        numDislikes,
        percentLikes,
        percentDislikes,
        reaction,
        handleReact
    } as UseLikesReturn
}

export default useLikes;