import { type Post } from "../../types/post.ts";
import '@mantine/carousel/styles.css';
import React, {type Dispatch, useCallback, useEffect, useState} from "react";
import PostView from "./PostView.tsx";
import MatchPostView from "./MatchPostView.tsx";
import {deletePost, getChildren} from "../../request/posts.ts";
import {ActionIcon, Box, Button, Collapse, Group, Paper, Stack} from "@mantine/core";
import {IconChevronDown, IconChevronUp, IconTrash} from "@tabler/icons-react";
import Likes from "../likes/Likes.tsx";
import PostFlagButton from "./PostFlagButton.tsx";
import PostCreate from "./PostCreate.tsx";
import {MessageCircle} from "lucide-react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {hasEditPermission} from "../../types/accountTypes.ts";
import PostApprovalContainer from "./PostApprovalContainer.tsx";


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

    const setApprovedPost = useCallback((post: Post) => {
        setChildren(prev => prev.map((p) => {
            if (p.id === post.id) {
                p.isApproved = true;
            }
            return p;
        }));
    }, []);

    const deleteDisapprovedPost = useCallback((post: Post) => {
        setChildren(prev => prev.filter((p) => p.id !== post.id));
    }, []);


    const handleDelete = async () => {
        const deleted = await deletePost(post.id);

        console.log(deleted);

        if (deleted) setPosts(prev => prev.filter(p => p.id !== post.id))
    }

    return (
        <Paper
            p="md"
            withBorder
            data-testid="post-container"
        >
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
                                        child.isApproved ?
                                            <PostContainer
                                                key={child.id}
                                                post={child}
                                                setPosts={setChildren}
                                            />
                                            :
                                            <PostApprovalContainer
                                                key={child.id}
                                                post={child}
                                                onApprove={setApprovedPost}
                                                onDisapprove={deleteDisapprovedPost}
                                                hasApprovalText
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
                        data-testid="post-delete-icon"
                    >
                        <IconTrash/>
                    </ActionIcon>
                )}
            </Group>
        </Paper>
    )
}

export default PostContainer;
