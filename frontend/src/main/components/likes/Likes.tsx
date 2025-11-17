import {Paper, Progress, Stack} from "@mantine/core";
import useLikes from "../../hooks/useLikes.tsx";
import LikesButtons from "./LikesButtons.tsx";
import type {LikeType} from "../../types/like.ts";
import LikesButtonsCompact from "./LikesButtonsCompact.tsx";

interface LikesProps {
    entityId: number,
    likeType: LikeType
    compact?: boolean
}

const Likes = ({ entityId, likeType, compact}: LikesProps) => {

    const likeData = useLikes({entityId, likeType})

    const buttons = compact ? <LikesButtonsCompact {...likeData}/> : <LikesButtons {...likeData}/>

    return (
        (compact ? buttons : (
            <Paper shadow="sm" radius="md" p="xl" withBorder>
                <Stack gap="md">

                    {buttons}
                    <Progress.Root size="lg" radius="md">
                        <Progress.Section
                            value={likeData.percentLikes}
                            animated={likeData.reaction?.liked === true}
                        />
                        <Progress.Section
                            value={likeData.percentDislikes}
                            color="gray"
                            animated={likeData.reaction?.liked === false}
                        />
                    </Progress.Root>
                </Stack>
            </Paper>
            )
        )
    )
}

export default Likes;
