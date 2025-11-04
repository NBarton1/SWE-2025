import type {Team} from "../types/team.ts";
import type {Coach, Player} from "../types/accountTypes.ts";

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
