import { type Post } from "../../types/post.ts";
import '@mantine/carousel/styles.css';
import React, {type Dispatch, useEffect, useState} from "react";
import PostView from "./PostView.tsx";
import MatchPostView from "./MatchPostView.tsx";
import {getChildren} from "../../request/posts.ts";
import {Box, Button, Collapse, Group, Paper, Stack} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";
import Likes from "../likes/Likes.tsx";
import PostFlagButton from "./PostFlagButton.tsx";
import PostCreate from "./PostCreate.tsx";
import {MessageCircle} from "lucide-react";


interface PostContainerProps {
    post: Post
    setPosts: Dispatch<React.SetStateAction<Post[]>>
}

function PostContainer({ post, setPosts }: PostContainerProps) {
    const [children, setChildren] = useState<Post[]>([]);
    const [commentsOpen, setCommentsOpen] = useState(false);


    useEffect(() => {
        getChildren(post).then((children) => {
            setChildren(children)
        });
    }, [post])

    return (
        <>
            <Box
                style={{ flex: 1 }}
            >
                <Paper p="md" withBorder>
                    {post.match ? (
                        <MatchPostView
                            post={post}
                            setPosts={setPosts}
                        />
                    ) : (
                        <PostView
                            post={post}
                            setPosts={setPosts}
                        />
                    )}


                    <Stack gap="sm">
                        <Group>
                            <Likes entityId={post.id} likeType="POST" compact/>
                            <PostFlagButton postId={post.id}/>
                            <Button
                                onClick={() => setCommentsOpen(!commentsOpen)}
                                rightSection={commentsOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                                variant="light"
                            >
                                <MessageCircle/>
                            </Button>
                        </Group>

                        <Collapse in={commentsOpen}>
                            <Stack mt="md" p="md">
                                <PostCreate setPosts={setChildren} parent={post} clearFormOnSubmit/>
                                {children.map(child => (
                                    <PostContainer
                                        key={child.id}
                                        post={child}
                                        setPosts={setChildren}
                                    />
                                ))}
                            </Stack>
                        </Collapse>
                    </Stack>
                </Paper>
            </Box>
        </>
    )
}

export default PostContainer;
