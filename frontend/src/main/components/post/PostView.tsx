import PostMediaCarousel from "./PostMediaCarousel.tsx";
import {formatCreationTime, type Post} from "../../types/post.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import '@mantine/carousel/styles.css';
import {IconTrash} from "@tabler/icons-react";
import {accountEquals, isAdmin} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";
import {deletePost} from "../../request/post.ts";
import {Avatar, Group, Paper, Title, Text, Stack, Anchor, ActionIcon} from "@mantine/core";


interface PostViewProps {
    post: Post;
    onDelete: (id: number) => void;
}

function PostView({post, onDelete}: PostViewProps) {
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

    const {currentAccount} = useAuth()

    const account = post.account;

    const handleDelete = () => {
        const deleted = deletePost(post.id);
        if (!deleted) return

        onDelete(post.id)
    };

    return (
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

                {(accountEquals(account, currentAccount) || isAdmin(currentAccount)) && (
                    <ActionIcon variant="subtle" color="red" ml="auto" onClick={handleDelete}>
                        <IconTrash/>
                    </ActionIcon>
                )}
            </Group>

            <PostMediaCarousel post={post}/>

            <EditorContent editor={editor}/>
        </Paper>
    );
}

export default PostView;
