import type {Team} from "../types/team.ts";
import type {Coach, Player} from "../types/accountTypes.ts";

export interface TeamCreateRequest {
    name: string;
}

export const createTeam = async (req: TeamCreateRequest) => {
    return await fetch("http://localhost:8080/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(req),
    });
};

export const getTeams = async (): Promise<Team[]> => {
    try {
        const res = await fetch("http://localhost:8080/api/teams", {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to get teams", err);
        return [];
    }
};

export const getTeam = async (id: number): Promise<Team | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/teams/${id}`, {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to get team ${id}:`, err);
        return null;
    }
};

export const assignCoachToTeam = async (teamId: number) => {
    try {
        const res = await fetch(`http://localhost:8080/api/teams/${teamId}/coaches`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to set coaching team to ${teamId}`, err);
        return null
    }
};

export const getTeamPlayers = async (id: number): Promise<Player[]> => {
    try {
        const res = await fetch(`http://localhost:8080/api/teams/${id}/players`, {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to get players on team ${id}:`, err);
        return [];
    }
};

export const getTeamCoaches = async (id: number): Promise<Coach[]> => {
    try {
        const res = await fetch(`http://localhost:8080/api/teams/${id}/coaches`, {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to get coaches on team ${id}:`, err);
        return [];
    }
};

export const invitePlayerFromTeam = async (playerId: number) => {
    return await fetch(`http://localhost:8080/api/teams/${playerId}/invite`, {
        method: "POST",
        credentials: "include",
    });
};

export const removePlayerFromTeam = async (playerId: number): Promise<boolean> => {
    try {
        await fetch(`http://localhost:8080/api/teams/${playerId}`, {
            method: "DELETE",
            credentials: "include",
        });

        return true;
    } catch (err) {
        console.error(`Failed to remove player ${playerId}`, err);
        return false;
    }
};
