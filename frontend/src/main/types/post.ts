import type {Content} from "./content.ts";

export interface Post {
    id: number,
    textContent: string,
    likeCount: number,
    dislikeCount: number,
    media: Content[]
}
