import type {Flag} from "../types/flag.ts";

export const getFlagCountForPost = async (postId: number): Promise<number> => {
    try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}/flags`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return Number(await res.json());
    } catch (err) {
        console.error("Failed to get flags for post ", err);
        return 0;
    }
};

export const flagPost = async (postId: number): Promise<Flag | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}/flags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to flag post ", err);
        return null;
    }
};

export const getFlag = async (postId: number): Promise<Flag | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}/flag`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return await res.json();
    } catch (err) {
        console.error("Failed get flag ", err);
        return null;
    }
};

export const deleteFlag = async (id: number): Promise<boolean> => {
    try {
        await fetch(`http://localhost:8080/api/flags/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return true;
    } catch (err) {
        console.error("Failed to delete flag for post ", err);
        return false;
    }
};