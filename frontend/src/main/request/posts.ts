import type {JSONContent} from "@tiptap/react";
import type {Post} from "../types/post.ts";


export interface PostRequestFields {
    textContent: JSONContent,
    mediaFiles: File[],
    parentId: number,
}

export type PostCreateRequest = Partial<PostRequestFields>;

export const createPost = async (req: PostCreateRequest): Promise<Post | null> => {
    try {
        const formData = new FormData();

        if (req.mediaFiles && req.mediaFiles.length > 0) {
            req.mediaFiles.forEach(file => formData.append("media", file));
        }

        formData.append("textContent", JSON.stringify(req.textContent));

        if (req.parentId) formData.append("parentId", req.parentId.toString());

        const res = await fetch("http://localhost:8080/api/posts", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        return await res.json();
    } catch (err) {
        console.error("Failed to create post", err);
        return null;
    }
};

export const getAllPosts = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/posts", {
            method: "GET",
            credentials: "include",
        });

        return await res.json();
    } catch (err) {
        console.error("Failed to get all posts", err);
        return [];
    }
};

export const deletePost = async (id: number) => {
    try {
        await fetch(`http://localhost:8080/api/posts/${id}`, {
            method: "DELETE",
            credentials: 'include',
        });
        return true;
    } catch (err) {
        console.error("Failed to delete", err);
    }
    return false
};

export const getChildren = async (post: Post) => {
    try {
        const res = await fetch(`http://localhost:8080/api/posts/${post.id}/children`, {
            method: "GET",
            credentials: 'include',
        });

        return await res.json();
    } catch (err) {
        console.error("Failed to get children", err);
    }
    return [];
};

export const getFlaggedPosts = async (): Promise<Post[]> => {
    try {
        const res = await fetch("http://localhost:8080/api/posts/flags", {
            method: "GET",
            credentials: 'include',
        });

        return await res.json()
    } catch (err) {
        console.error("Failed to get flagged posts", err)
    }
    return [];
}