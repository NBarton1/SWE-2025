import Highlight from '@tiptap/extension-highlight';
import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import '@mantine/tiptap/styles.css';
import {Button, FileButton, Paper, Stack, Group, ActionIcon, Title} from "@mantine/core";
import {useCallback, useState} from "react";
import {IconX} from '@tabler/icons-react';
import {createPost, type PostCreateRequest} from "../../request/posts.ts";
import PostMediaPreview from "./PostMediaPreview.tsx";
import type {ContentPreview} from "../../types/content.ts";
import PostStatusPopup from "./PostStatusPopup.tsx";
import PostTextEditor from "./PostTextEditor.tsx";
import {comparePosts, type Post} from "../../types/post.ts";


interface PostCreateProps {
    setPosts:  React.Dispatch<React.SetStateAction<Post[]>>;
    parent?: Post;
    popup?: boolean;
    clearFormOnSubmit?: boolean;
}

function PostCreate({ setPosts, parent, popup, clearFormOnSubmit }: PostCreateProps) {
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

    const addMedia = useCallback((file: File | null) => {
        if (file) {
            const url = URL.createObjectURL(file);

            const contentPreview: ContentPreview = {
                file: file,
                previewUrl: url,
            }

            setPreviewFiles([...previewFiles, contentPreview])
        }
    }, [previewFiles]);

    const removeMedia = useCallback((index: number) => {
        URL.revokeObjectURL(previewFiles[index].previewUrl);

        setPreviewFiles(previewFiles.filter((_, i) => i !== index));
    }, [previewFiles]);

    const clearForm = useCallback(() => {
        editor?.commands.clearContent();
        previewFiles.forEach(p => URL.revokeObjectURL(p.previewUrl));
        setPreviewFiles([]);
    }, [editor?.commands, previewFiles]);

    const handleCreatePost = useCallback(async () => {
        if (!editor) return;

        const jsonContent = editor.getJSON();
        const createPostReq: PostCreateRequest = {
            parentId: parent?.id,
            mediaFiles: previewFiles.map(preview => preview.file),
            textContent: jsonContent,
        };

        const post = await createPost(createPostReq)
        if (post) {
            console.log(post)
            setPostCreateError(false);
            setPosts(prev => [...prev, post].sort(comparePosts));
        } else {
            setPostCreateError(true);
        }

        if (popup) setStatusPopupOpen(true);
        if (clearFormOnSubmit) clearForm();
    }, [editor, parent, previewFiles, popup, clearFormOnSubmit, clearForm, setPosts]);


    return (
        <Paper
            shadow="sm"
            p="md"
            radius="md"
            data-testid="post-create"
            withBorder
        >
            <Stack gap="md">
                <Title order={3} ta="center">New {parent ? "Reply" : "Post"}</Title>

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
                        data-testid="upload-media-button"
                    >
                        {(props) => (
                            <Button {...props}>
                                Upload Media
                            </Button>
                        )}
                    </FileButton>

                    <Button
                        onClick={handleCreatePost}
                        data-testid="create-post-button"
                    >
                        Create {parent ? "Reply" : "Post"}
                    </Button>
                </Group>

                <PostStatusPopup open={statusPopupOpen} setOpen={setStatusPopupOpen} error={postCreateError} />
            </Stack>
        </Paper>
    );
}

export default PostCreate;
