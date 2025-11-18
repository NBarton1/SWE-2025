import type {UseLikesReturn} from "../../hooks/useLikes.tsx";
import {Button, Flex} from "@mantine/core";
import {ThumbsDown, ThumbsUp} from "lucide-react";

const LikesButtonsCompact = ({
                                 numLikes,
                                 numDislikes,
                                 percentLikes,
                                 percentDislikes,
                                 reaction,
                                 handleReact
}: UseLikesReturn) => {
    return (
        <Flex gap="sm" align="center">
            <Button
                size="sm"
                variant={reaction?.liked === true ? "filled" : "light"}
                color="gray"
                onClick={() => handleReact(true)}
                leftSection={<ThumbsUp size={16}/>}
            >
                {`${numLikes} (${Math.round(percentLikes)}%)`}
            </Button>
            <Button
                size="sm"
                variant={reaction?.liked === false ? "filled" : "light"}
                color="gray"
                onClick={() => handleReact(false)}
                leftSection={<ThumbsDown size={16}/>}
            >
                {`${numDislikes} (${Math.round(percentDislikes)}%)`}
            </Button>
        </Flex>
    )
}

export default LikesButtonsCompact