import MediaCarousel from "./MediaCarousel.tsx";
import type {Post} from "../../types/post.ts";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import '@mantine/carousel/styles.css';
import {Paper} from "@mantine/core";


interface PostViewProps {
    post: Post
}

function PostView({ post }: PostViewProps) {
    const editor = useEditor({
        editable: false,
        content: JSON.parse(post.textContent),
        extensions: [StarterKit],
    });

    return (
        <Paper p="md" withBorder>
            <MediaCarousel post={post} />
            <EditorContent editor={editor} />
        </Paper>
    );
}

export default PostView;
