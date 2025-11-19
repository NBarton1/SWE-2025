import { type Post } from "../../types/post.ts";
import '@mantine/carousel/styles.css';
import React, {type Dispatch, useEffect, useState} from "react";
import PostView from "./PostView.tsx";
import {Match} from "../../types/match.ts";
import MatchPostView from "./MatchPostView.tsx";
import {getChildren} from "../../request/post.ts";
import {Box, Button, Collapse, Stack} from "@mantine/core";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";


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
    }, [])

    return (
        <>
            {post.match ? (
                <MatchPostView
                    match={new Match(post.match)}
                    setPosts={setPosts}
                    setSelectedMatch={setSelectedMatch}
                />
            ) : (
                <PostView
                    post={post}
                    setPosts={setPosts}
                />
            )}

            <Box>
                <Button
                    onClick={() => setCommentsOpen(!commentsOpen)}
                    rightSection={commentsOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    variant="light"
                >
                    {commentsOpen ? "Hide Replies" : "Show Replies"}
                </Button>

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
            </Box>
        </>
    )
}

export default PostContainer;
