import PostMediaCarousel from "./PostMediaCarousel.tsx";
import {formatCreationTime, type Post} from "../../types/post.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import '@mantine/carousel/styles.css';
import {Avatar, Group, Paper, Title, Text, Stack, Anchor} from "@mantine/core";


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
        <Paper p="md" withBorder>
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

            <PostMediaCarousel post={post} />

            <EditorContent editor={editor} />
        </Paper>
    );
}

export default PostView;
