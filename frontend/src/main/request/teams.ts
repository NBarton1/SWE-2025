import type {Team} from "../schedule/team.ts";

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
