import {Button, Flex, Paper, Progress, Stack} from "@mantine/core";
import {ThumbsDown, ThumbsUp} from "lucide-react";
import {useCallback, useEffect, useMemo, useState} from "react";
import type {LikeStatus, LikeType} from "../../types/like.ts";
import {
    type CountLikeStatusFunction, deleteLike, getCoachLikeStatus,
    getCoachLikeStatusCount, getPostLikeStatus,
    getPostLikeStatusCount,
    likeCoach,
    likePost
} from "../../request/likes.ts";

interface LikesBarProps {
    entityId: number
    likeType: LikeType
}

const LikesBar = ({ entityId, likeType }: LikesBarProps) => {

    const [numLikes, setNumLikes] = useState(0)
    const [numDislikes, setNumDislikes] = useState(0)
    const [reaction, setReaction] = useState<LikeStatus | null>(null)

    const percentLikes = useMemo(() => {
        return (numLikes / (numLikes + numDislikes)) * 100
    }, [numDislikes, numLikes]);

    const percentDislikes = useMemo(() => {
        return (numDislikes / (numLikes + numDislikes)) * 100
    }, [numDislikes, numLikes]);


    const setLikeData = useCallback(async (
        countLikeStatusFunction: CountLikeStatusFunction,
    ) => {
        const likes = await countLikeStatusFunction(entityId, true)
        if (likes !== null) {
            setNumLikes(likes)
        }

        const dislikes = await countLikeStatusFunction(entityId, false)
        if (dislikes !== null) {
            setNumDislikes(dislikes)
        }
    }, [entityId, reaction])

    useEffect(() => {
        switch (likeType) {
            case "COACH": {
                setLikeData(
                    getCoachLikeStatusCount,
                ).then()
                break;
            }
            case "POST": {
                setLikeData(
                    getPostLikeStatusCount,
                ).then()
            }
        }
    }, [likeType, setLikeData]);

    const handleUnreact = useCallback(async (status: LikeStatus) => {
        await deleteLike(status.id)
        setReaction(null)
    }, []);

    const handleReact = useCallback(async (liked: boolean) => {

        if (reaction && liked === reaction.liked) {
            await handleUnreact(reaction)
            return
        }

        switch (likeType) {
            case "COACH": {
                await likeCoach(entityId, liked)
                const reaction = await getCoachLikeStatus(entityId)
                setReaction(reaction)
                break;
            }
            case "POST": {
                await likePost(entityId, liked)
                const reaction = await getPostLikeStatus(entityId)
                setReaction(reaction)
                break;
            }
        }
    }, [entityId, handleUnreact, likeType, reaction]);

    return (
        <Paper shadow="sm" radius="md" p="md" withBorder>
            <Stack gap="md">
                <Flex gap="sm" align="stretch">
                    <Button
                        flex={1}
                        variant={reaction?.liked === true ? "filled" : "light"}
                        color="gray"
                        size="md"
                        onClick={() => handleReact(true)}
                        leftSection={<ThumbsUp size={18} />}
                    >
                        {numLikes}

                        {` (${Math.round(percentLikes)}%)`}
                    </Button>
                    <Button
                        flex={1}
                        variant={reaction?.liked === false ? "filled" : "light"}
                        color="gray"
                        size="md"
                        onClick={() => handleReact(false)}
                        leftSection={<ThumbsDown size={18} />}
                    >
                        {numDislikes}
                        {` (${Math.round(percentDislikes)}%)`}
                    </Button>
                </Flex>

                <Progress.Root size="lg" radius="md">
                    <Progress.Section
                        value={percentLikes}
                        color="blue"
                        animated={reaction?.liked === true}
                    />
                    <Progress.Section
                        value={percentDislikes}
                        color="gray"
                        animated={reaction?.liked === false}
                    />
                </Progress.Root>
            </Stack>
        </Paper>
    )
}

export default LikesBar;
