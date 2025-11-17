import type {Content} from "../types/content.ts";

export const getUnapprovedContent = async (): Promise<Content[]> => {
    try {
        const res = await fetch("http://localhost:8080/api/content/unapproved", {
            method: "GET",
            credentials: 'include'
        });
        return res.json();
    } catch (err) {
        console.error("Failed to get content", err);
        return [];
    }
};

export const approveContent = async (id: number): Promise<Content | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/content/${id}`, {
            method: "PATCH",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to approve content", err);
        return null;
    }
};

export const deleteContent = async (id: number) => {
    try {
        const res = await fetch(`http://localhost:8080/api/content/${id}`, {
            method: "DELETE",
            credentials: 'include'
        });

        return res.ok
    } catch (err) {
        console.error("Failed to delete content", err);
    }
    return false;
};