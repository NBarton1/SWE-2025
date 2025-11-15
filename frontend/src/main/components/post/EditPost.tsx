import Highlight from '@tiptap/extension-highlight';
import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '@mantine/tiptap/styles.css';
import {Button, FileButton, Paper, Stack, Group, ActionIcon, Title} from "@mantine/core";
import {useState} from "react";
import {IconX} from '@tabler/icons-react';
import {createPost, type PostCreateRequest} from "../../request/post.ts";
import PostMediaPreview from "./PostMediaPreview.tsx";
import type {ContentPreview} from "../../types/content.ts";
import PostStatusPopup from "./PostStatusPopup.tsx";
import PostTextEditor from "./PostTextEditor.tsx";


function EditPost() {
    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: [StarterKit, Highlight],
        editorProps: {
            attributes: {
                style: "font-size: 30px;",
            },
        },
    });

    const [previewFiles, setPreviewFiles] = useState<ContentPreview[]>([]);
    const [statusPopupOpen, setStatusPopupOpen] = useState<boolean>(false);
    const [postCreateError, setPostCreateError] = useState<boolean>(false);

    const addMedia = (file: File | null) => {
        if (file) {
            const url = URL.createObjectURL(file);

            const contentPreview: ContentPreview = {
                file: file,
                previewUrl: url,
            }

            setPreviewFiles([...previewFiles, contentPreview])
        }
    };

    const removeMedia = (index: number) => {
        URL.revokeObjectURL(previewFiles[index].previewUrl);

        setPreviewFiles(previewFiles.filter((_, i) => i !== index));
    };

    const handleCreatePost = async () => {
        if (!editor) return;

        const jsonContent = editor.getJSON();
        const createPostReq: PostCreateRequest = {
            mediaFiles: previewFiles.map(preview => preview.file),
            textContent: jsonContent,
        };

        if (await createPost(createPostReq)) {
            setPostCreateError(false);
        } else {
            setPostCreateError(true);
        }

        setStatusPopupOpen(true);
    };

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="md">
                <Title order={3} ta="center">New Post</Title>

                {previewFiles.length > 0 && (
                    <Group gap="xs" align="flex-start">
                        {previewFiles.map((preview, index) => (
                            <Group gap="xs" align="flex-start">
                                <PostMediaPreview contentPreview={preview}/>
                                <ActionIcon
                                    color="red"
                                    variant="light"
                                    onClick={() => removeMedia(index)}
                                    size="sm"
                                >
                                    <IconX size={16}/>
                                </ActionIcon>
                            </Group>
                        ))}
                    </Group>
                )}

                <PostTextEditor editor={editor}/>

                <Group>
                    <FileButton
                        onChange={addMedia}
                        accept="image/png,image/jpeg,image/gif"
                    >
                        {(props) => (
                            <Button {...props}>
                                Upload Media
                            </Button>
                        )}
                    </FileButton>

                    <Button
                        onClick={handleCreatePost}
                    >
                        Create Post
                    </Button>
                </Group>

                <PostStatusPopup open={statusPopupOpen} setOpen={setStatusPopupOpen} error={postCreateError} />
            </Stack>
        </Paper>
    );
}

export default EditPost;
