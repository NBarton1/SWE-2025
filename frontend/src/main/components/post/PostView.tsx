import PostMediaCarousel from "./PostMediaCarousel.tsx";
import {formatCreationTime, type Post} from "../../types/post.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import '@mantine/carousel/styles.css';
import {IconTrash} from "@tabler/icons-react";
import {hasEditPermission} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";
import {deletePost} from "../../request/post.ts";
import {Avatar, Group, Title, Text, Stack, Anchor, ActionIcon, Paper, Box} from "@mantine/core";
import Likes from "../likes/Likes.tsx";
import React, {type Dispatch} from "react";


interface PostViewProps {
    post: Post;
    setPosts: Dispatch<React.SetStateAction<Post[]>>;
}

function PostView({post, setPosts}: PostViewProps) {


    const editor = useEditor({
        editable: false,
        content: post.textContent == "" ? "" : JSON.parse(post.textContent),
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                style: "font-size: 30px;",
            },
        },
    });

    const {currentAccount} = useAuth()

    const account = post.account;

    const handleDelete = async () => {
        const deleted = await deletePost(post.id);

        if (deleted) setPosts(prev => prev.filter(p => p.id !== post.id))
    };

    return (
        <Group
            justify="space-between"
            align="flex-start"
            wrap="nowrap"
        >
            <Box
                style={{ flex: 1 }}
            >
                <Paper p="md" withBorder>
                    <Group>
                        <Anchor
                            href={`/profile/${account?.id}`}
                            c="inherit"
                            underline="never"
                        >
                            <Group>
                                <Avatar
                                    src={account?.picture?.downloadUrl}
                                    radius="sm"
                                    name={account?.name}
                                    size="lg"
                                />

                                <Stack gap="xs">
                                    <Title order={3}>
                                        {account?.name}
                                    </Title>

                                    <Text size="sm" c="dimmed">
                                        {account ? `@${account.username}` : "Deleted User"} · {formatCreationTime(post)}
                                    </Text>
                                </Stack>
                            </Group>
                        </Anchor>
                    </Group>

                    <PostMediaCarousel post={post}/>

                    <EditorContent editor={editor}/>
                    <Likes entityId={post.id} likeType="POST" compact/>
                </Paper>
            </Box>

            {hasEditPermission(currentAccount, account) && (
                <ActionIcon variant="subtle" color="red" ml="auto" onClick={handleDelete}>
                    <IconTrash/>
                </ActionIcon>
            )}

        </Group>
    );
}

export default PostView;
