import MediaCarousel from "./MediaCarousel.tsx";
import {formatCreationTime, type Post} from "../../types/post.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import '@mantine/carousel/styles.css';
import {Avatar, Group, Paper, Title, Text, Stack} from "@mantine/core";
import Likes from "../likes/Likes.tsx";


interface PostViewProps {
    post: Post
}

function PostView({ post }: PostViewProps) {
    const editor = useEditor({
        editable: false,
        content: JSON.parse(post.textContent),
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                style: "font-size: 30px;",
            },
        },
    });

    const account = post.account;

    return (
        <Stack>
            <Paper p="md" withBorder>
                <Group>
                    <Avatar
                        src={account?.picture?.downloadUrl}
                        radius="sm"
                        name={account.name}
                    />

                    <Title>
                        {account.username}
                        <Text component="span" c="dimmed"> · {formatCreationTime(post)}</Text>
                    </Title>
                </Group>

                <MediaCarousel post={post} />

                <EditorContent editor={editor} />
            <Likes entityId={post.id} likeType="POST"/>
            </Paper>
        </Stack>
    );
}

export default PostView;
