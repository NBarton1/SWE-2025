import type {LikeStatus} from "../types/like.ts";

export type CountLikeStatusFunction = (entityId: number, liked: boolean) => Promise<number | null>
export type GetLikeStatusForUserFunction = (entityId: number) => Promise<LikeStatus | null>


export const likeCoach = async (coachId: number, liked: boolean) => {
    try {
        const res = await fetch(`http://localhost:8080/api/coaches/${coachId}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: String(liked),
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to get likes for coach ${coachId}`, err);
        return null;
    }
}

export const likePost = async (postId: number, liked: boolean) => {
    try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: String(liked),
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to get likes for coach ${postId}`, err);
        return null;
    }
}

export const deleteLike = async (likeId: number) => {
    try {
        const res = await fetch(`http://localhost:8080/api/likes/${likeId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to delete like ${likeId}`, err);
        return null;
    }
}

export const getCoachLikeStatusCount: CountLikeStatusFunction = async (coachId: number, liked: boolean): Promise<number | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/coaches/${coachId}/${liked ? "likes" : "dislikes"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return Number(await res.text());
    } catch (err) {
        console.error(`Failed to get like count`, err);
        return null;
    }
}

export const getPostLikeStatusCount: CountLikeStatusFunction = async (postId: number, liked: boolean): Promise<number | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}/${liked ? "likes" : "dislikes"}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return Number(await res.text());
    } catch (err) {
        console.error(`Failed to get like count`, err);
        return null;
    }
}

export const getCoachLikeStatus: GetLikeStatusForUserFunction = async (coachId: number): Promise<LikeStatus | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/coaches/${coachId}/like`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to get like count`, err);
        return null;
    }
}

export const getPostLikeStatus: GetLikeStatusForUserFunction = async (postId: number): Promise<LikeStatus | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}/like`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to get like count`, err);
        return null;
    }
}

