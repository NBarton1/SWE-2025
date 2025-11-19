import { type Post } from "../../types/post.ts";
import '@mantine/carousel/styles.css';
import React, {type Dispatch, useEffect, useState} from "react";
import PostView from "./PostView.tsx";
import {Match} from "../../types/match.ts";
import MatchPostView from "./MatchPostView.tsx";
import {getChildren} from "../../request/post.ts";
import {Box, Button, Collapse, Group, Paper, Stack} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";
import Likes from "../likes/Likes.tsx";
import PostFlagButton from "./PostFlagButton.tsx";


interface PostContainerProps {
    post: Post
    setPosts: Dispatch<React.SetStateAction<Post[]>>
    setSelectedMatch: Dispatch<React.SetStateAction<Match | null>>
}

function PostContainer({ post, setPosts, setSelectedMatch }: PostContainerProps) {
    const [children, setChildren] = useState<Post[]>([]);
    const [commentsOpen, setCommentsOpen] = useState(false);


    useEffect(() => {
        getChildren(post).then((children) => {
            console.log(children)
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
                            setSelectedMatch={setSelectedMatch}
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
                            <Box>
                                <Button
                                    onClick={() => setCommentsOpen(!commentsOpen)}
                                    rightSection={commentsOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                                    variant="light"
                                >
                                    {commentsOpen ? "Hide Replies" : "Show Replies"}
                                </Button>
                            </Box>
                        </Group>
                        <Collapse in={commentsOpen}>
                            <Stack mt="md" p="md">
                                {children.map(child => (
                                    <PostContainer
                                        post={child}
                                        setPosts={setPosts}
                                        setSelectedMatch={setSelectedMatch} />
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
