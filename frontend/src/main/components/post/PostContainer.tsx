import { type Post } from "../../types/post.ts";
import '@mantine/carousel/styles.css';
import React, {type Dispatch, useEffect, useState} from "react";
import PostView from "./PostView.tsx";
import MatchPostView from "./MatchPostView.tsx";
import {deletePost, getChildren} from "../../request/posts.ts";
import {ActionIcon, Box, Button, Collapse, Group, Paper, Stack} from "@mantine/core";
import {IconChevronDown, IconChevronUp, IconTrash} from "@tabler/icons-react";
import Likes from "../likes/Likes.tsx";
import PostFlagButton from "./PostFlagButton.tsx";
import PostCreate from "./PostCreate.tsx";
import {MessageCircle} from "lucide-react";
import {hasEditPermission} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";


interface PostContainerProps {
    post: Post
    setPosts: Dispatch<React.SetStateAction<Post[]>>
}

function PostContainer({ post, setPosts }: PostContainerProps) {
    const [children, setChildren] = useState<Post[]>([]);
    const [commentsOpen, setCommentsOpen] = useState(false);

    const {currentAccount} = useAuth();

    useEffect(() => {
        getChildren(post).then((children) => {
            setChildren(children)
        });
    }, [post])

    const handleDelete = async () => {
        const deleted = await deletePost(post.id);

        console.log(deleted);

        if (deleted) setPosts(prev => prev.filter(p => p.id !== post.id))
    }

    return (
        <Paper p="md" withBorder>
            <Group>
                <Box
                    style={{ flex: 1 }}
                >
                        {post.match ? (
                            <MatchPostView
                                post={post}
                            />
                        ) : (
                            <PostView
                                post={post}
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
                </Box>

                {hasEditPermission(currentAccount, post.account) && (
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        ml="auto"
                        mb="auto"
                        onClick={handleDelete}
                    >
                        <IconTrash/>
                    </ActionIcon>
                )}
            </Group>
        </Paper>
    )
}

export default PostContainer;
