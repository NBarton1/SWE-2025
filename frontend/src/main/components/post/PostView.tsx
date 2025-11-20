import PostMediaCarousel from "./PostMediaCarousel.tsx";
import {formatCreationTime, type Post} from "../../types/post.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import '@mantine/carousel/styles.css';
import {IconTrash} from "@tabler/icons-react";
import {accountEquals, isAdmin} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";
import {deletePost} from "../../request/posts.ts";
import {Avatar, Group, Title, Text, Stack, Anchor, ActionIcon} from "@mantine/core";
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
        <>
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

                {(accountEquals(account, currentAccount) || isAdmin(currentAccount)) && (
                    <ActionIcon variant="subtle" color="red" ml="auto" mb="auto" onClick={handleDelete}>
                        <IconTrash/>
                    </ActionIcon>
                )}
            </Group>

            <PostMediaCarousel post={post}/>

            <EditorContent editor={editor}/>
        </>
    );
}

export default PostView;
