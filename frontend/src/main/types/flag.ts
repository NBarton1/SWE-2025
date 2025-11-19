import type {Post} from "./post.ts";
import type {Account} from "./accountTypes.ts";

export interface Flag {
    post: Post,
    account: Account,
}
