import type {JSONContent} from "@tiptap/react";

export interface PostCreateRequest {
    textContent: JSONContent,
    mediaFiles: File[],
    parentId: number | null,
}

export const createPost = async (req: PostCreateRequest) => {
    try {
        const formData = new FormData();

        if (req.mediaFiles && req.mediaFiles.length > 0) {
            console.log(req.mediaFiles[0]);
            req.mediaFiles.forEach(file => formData.append("media", file));
        }

        formData.append("textContent", JSON.stringify(req.textContent));

        if (req.parentId) formData.append("parentId", req.parentId.toString());

        console.log(formData);

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
