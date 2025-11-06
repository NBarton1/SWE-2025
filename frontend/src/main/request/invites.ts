import type {TeamInvite} from "../types/invite.ts";
import type {Player} from "../types/accountTypes.ts";

export const getInvites = async (): Promise<TeamInvite[]> => {
    try {
        const res = await fetch(`http://localhost:8080/api/players/invites`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to get player invites ", err);
        return [];
    }
};

export interface PlayerInviteRequest {
    isAccepted: boolean;
}

export const respondToInvite = async (teamId: number, req: PlayerInviteRequest): Promise<Player | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/players/invites/${teamId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(req),
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to respond to invite for team ${teamId} `, err);
        return null;
    }
};
