import type {Account} from "./accountTypes.ts";


export type LikeType = "COACH" | "POST"

export interface LikeStatus {
    id: number,
    account: Account,
    likeType: LikeType,
    entityId: number,
    liked: boolean
}