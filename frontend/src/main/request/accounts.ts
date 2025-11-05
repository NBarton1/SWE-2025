import type {Account, Player, Role} from "../types/accountTypes.ts";

interface UpdateAccountRequest {
    name?: string,
    username?: string,
    picture?: ArrayBuffer | null,
    email?: string | null
    role?: Role
}

export const getAccounts = async (): Promise<Account[]> => {
    try {
        const res = await fetch("http://localhost:8080/api/accounts", {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to get accounts", err);
        return [];
    }
};


export const getAccount = async (
    accountId: number,
): Promise<Account | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/accounts/${accountId}`, {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to get account ${accountId}`, err);
        return null;
    }
};


export const updateAccount = async (account: UpdateAccountRequest): Promise<Account | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/accounts`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(account)
        });
        return await res.json();
    } catch (err) {
        console.error(`Failed to update account ${account.username}`, err);
        return null;
    }
};

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