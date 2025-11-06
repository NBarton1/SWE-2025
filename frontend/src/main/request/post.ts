
export interface PostCreateRequest {
    content: string,
    parentId: number | null,
}

export const createPost = async (req: PostCreateRequest) => {
    try {
        const res = await fetch("http://localhost:8080/api/posts", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req)
        });

        return await res.json();
    } catch (err) {
        console.error("Failed to create post", err);
        return null;
    }
};
