import {createBearerAuthHeader} from "../util.ts";

export const getTeams = async (jwt: string) => {
    try {
        const res = await fetch("http://localhost:8080/api/teams", {
            method: "GET",
            headers: { Authorization: createBearerAuthHeader(jwt) },
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to get teams", err);
        return [];
    }
};