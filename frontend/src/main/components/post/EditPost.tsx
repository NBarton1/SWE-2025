import Highlight from '@tiptap/extension-highlight';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import '@mantine/tiptap/styles.css';
import {Button, FileButton, Paper, Image, Stack, Group, ActionIcon, rem, Title} from "@mantine/core";
import {useState} from "react";
import { IconX } from '@tabler/icons-react';
import {createPost, type PostCreateRequest} from "../../request/post.ts";


function EditPost() {
    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: [StarterKit, Highlight],
    });

    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const insertImage = (file: File | null) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setMediaFiles([...mediaFiles, file]);
            setPreviewUrls([...previewUrls, url]);
        }
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previewUrls[index]);

        setMediaFiles(mediaFiles.filter((_, i) => i !== index));
        setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    };

    const handleCreatePost = async () => {
        if (!editor) return;

        const jsonContent = editor.getJSON();
        const createPostReq: PostCreateRequest = {
            mediaFiles: mediaFiles,
            textContent: jsonContent,
            parentId: null
        };

        const post = await createPost(createPostReq);
        console.log(post);
    };

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="md">
                <Title order={3} ta="center">New Post</Title>

                {previewUrls.length > 0 && (
                    <Group gap="xs" align="flex-start">
                        {previewUrls.map((imageURL, index) => (
                            <Group gap="xs" align="flex-start">
                                <Image
                                    src={imageURL}
                                    radius="md"
                                    fit="contain"
                                    h={rem(200)}
                                    w="auto"
                                />
                                <ActionIcon
                                    color="red"
                                    variant="light"
                                    onClick={() => removeImage(index)}
                                    size="sm"
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Group>
                        ))}
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
                                Upload Photo
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
