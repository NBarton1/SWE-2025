import type {Team} from "./team.ts";
import type {Player} from "./accountTypes.ts";

// @ts-ignore
export enum InviteStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
}

export interface TeamInvite {
    team: Team,
    player: Player,
    status: string,
}
