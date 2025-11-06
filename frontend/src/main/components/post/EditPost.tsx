import Highlight from '@tiptap/extension-highlight';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import '@mantine/tiptap/styles.css';
import {Button, FileButton, Paper, Image, Stack, Group, ActionIcon, rem, Title} from "@mantine/core";
import {useState} from "react";
import { IconX } from '@tabler/icons-react';
import {createPost} from "../../request/post.ts";


function EditPost() {
    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: [StarterKit, Highlight],
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const insertImage = (file: File | null) => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const removeImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    };

    const handleCreatePost = async () => {
        if (!editor) return;

        const htmlContent = editor.getHTML();
        const post = await createPost({ content: htmlContent, parentId: null })

        console.log(post);
    };

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="md">
                <Title order={3} ta="center">New Post</Title>

                {previewUrl && (
                    <Group gap="xs" align="flex-start">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            radius="md"
                            fit="contain"
                            h={rem(200)}
                            w="auto"
                        />
                        <ActionIcon
                            color="red"
                            variant="light"
                            onClick={removeImage}
                            size="sm"
                        >
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
                )}

                <RichTextEditor editor={editor} variant="subtle">
                    <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>

                <Group>
                    <FileButton
                        onChange={insertImage}
                        accept="image/png,image/jpeg,image/gif"
                    >
                        {(props) => (
                            <Button {...props}>
                                {previewUrl ? "Change Photo" : "Upload Photo"}
                            </Button>
                        )}
                    </FileButton>

                    <Button
                        onClick={handleCreatePost}
                    >
                        Create Post
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
}

export default EditPost;
