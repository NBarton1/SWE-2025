import type {Content} from "./content.ts";
import type {Account} from "./accountTypes.ts";

export interface Post {
    id: number,
    account: Account,
    textContent: string,
    likeCount: number,
    dislikeCount: number,
    media: Content[],
    creationTime: string,
}

export function formatCreationTime(post: Post): string {
    const date = new Date(post.creationTime);
    const now = new Date();

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function comparePosts(post0: Post, post1: Post) {
    return new Date(post1.creationTime).getTime() - new Date(post0.creationTime).getTime();
}
