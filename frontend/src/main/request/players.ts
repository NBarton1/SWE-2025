import type {Player} from "../types/accountTypes.ts";

export interface PlayerFilter {
    isOrphan?: boolean;
}

export const searchPlayers = async (filter?: PlayerFilter): Promise<Player[]> => {
    try {
        const res = await fetch("http://localhost:8080/api/players", {
            method: "POST",
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: filter ? JSON.stringify(filter) : null
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to get players", err);
        return [];
    }
};

export const adoptPlayer = async (playerId: number): Promise<Player | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/players/${playerId}/adopt`, {
            method: "POST",
            credentials: "include",
        });

        return await res.json();
    } catch (err) {
        console.error(`Failed to adopt player ${playerId}`, err);
        return null;
    }
};

export const setPlayerPermission = async (playerId: number, permission: boolean) => {
    try {
        const res = await fetch(`http://localhost:8080/api/players/${playerId}/permission`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ hasPermission: permission }),
        });

        return await res.json();
    } catch (err) {
        console.error(`Failed to update permission for player ${playerId}`, err);
        return null;
    }
};


