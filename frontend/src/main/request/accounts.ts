import type {Account} from "../types/account.ts";

export const getAccounts = async (): Promise<Account[]> => {
    try {
        const res = await fetch("http://localhost:8080/api/accounts", {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to get users", err);
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
        console.error("Failed to get users", err);
        return null;
    }
};
