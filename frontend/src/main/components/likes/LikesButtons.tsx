import {Button, Flex} from "@mantine/core";
import {ThumbsDown, ThumbsUp} from "lucide-react";
import type {UseLikesReturn} from "../../hooks/useLikes.tsx";


const LikesButtons = ({
                          numLikes,
                          numDislikes,
                          percentLikes,
                          percentDislikes,
                          reaction,
                          handleReact
                      }: UseLikesReturn) => {

    return (
        <Flex gap="sm" align="stretch">
            <Button
                flex={1}
                variant={reaction?.liked === true ? "filled" : "light"}
                color="gray"
                size="md"
                onClick={() => handleReact(true)}
                leftSection={<ThumbsUp size={18} />}
                data-testid="like-button"
            >
                {`${numLikes} (${Math.round(percentLikes)}%)`}
            </Button>
            <Button
                flex={1}
                variant={reaction?.liked === false ? "filled" : "light"}
                color="gray"
                size="md"
                onClick={() => handleReact(false)}
                leftSection={<ThumbsDown size={18} />}
                data-testid="dislike-button"
            >
                {`${numDislikes} (${Math.round(percentDislikes)}%)`}
            </Button>
        </Flex>
    )
}

export default LikesButtons;