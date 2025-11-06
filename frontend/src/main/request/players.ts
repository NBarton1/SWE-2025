import type {Player} from "../types/accountTypes.ts";
import type {SignupRequest} from "./signup.ts";

export const getPlayers = async (): Promise<Player[]> => {
    try {
        const res = await fetch("http://localhost:8080/api/players", {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to get players", err);
        return [];
    }
};

export const createPlayer = async (signupRequest: SignupRequest) => {
    return await fetch("http://localhost:8080/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(signupRequest),
    });
};