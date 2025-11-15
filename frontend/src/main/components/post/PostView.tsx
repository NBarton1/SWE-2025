import MediaCarousel from "./MediaCarousel.tsx";
import {formatCreationTime, type Post} from "../../types/post.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import '@mantine/carousel/styles.css';
import {Avatar, Group, Paper, Title, Text, ActionIcon} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import {accountEquals, isAdmin} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";
import {deletePost} from "../../request/post.ts";


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
                <Avatar
                    src={account?.picture?.downloadUrl}
                    radius="sm"
                    name={account.name}
                />

                <Title>
                    {account.username}
                    <Text component="span" c="dimmed"> · {formatCreationTime(post)}</Text>
                </Title>

                {(accountEquals(account, currentAccount) || isAdmin(currentAccount)) && (
                    <ActionIcon variant="subtle" color="red" ml="auto" onClick={handleDelete}>
                        <IconTrash />
                    </ActionIcon>
                )}
            </Group>

            <MediaCarousel post={post}/>

            <EditorContent editor={editor}/>
        </Paper>
    );
}

export default PostView;
