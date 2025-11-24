import {Button, Group} from "@mantine/core";
import Likes from "../likes/Likes.tsx";
import PostFlagButton from "./PostFlagButton.tsx";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";
import {MessageCircle} from "lucide-react";
import React from "react";
import type {Post} from "../../types/post.ts";

interface PostFooterProps {
    post: Post,
    commentsOpen: boolean,
    setCommentsOpen:  React.Dispatch<React.SetStateAction<boolean>>
}

const PostFooter = ({ post, commentsOpen, setCommentsOpen }: PostFooterProps) => {

    return (
        <Group
            data-testid="post-footer"
        >
            <Likes entityId={post.id} likeType="POST" compact/>
            <PostFlagButton postId={post.id}/>
            <Button
                onClick={() => setCommentsOpen(!commentsOpen)}
                rightSection={commentsOpen ?
                    <IconChevronUp data-testid="comments-open-indicator" size={16}/>
                    :
                    <IconChevronDown data-testid="comments-collapsed-indicator" size={16}/>}
                variant="light"
            >
                <MessageCircle/>
            </Button>
        </Group>
    )
}

export default PostFooter;