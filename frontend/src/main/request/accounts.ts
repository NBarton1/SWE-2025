import {type Account, type Player, Role} from "../types/accountTypes.ts";
import type {Content} from "@tiptap/react";


export interface UpdateAccountRequest {
    name?: string,
    username?: string,
    email?: string | null
    role?: Role | null
    password?: string | null
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


export const updateAccount = async (id: number, account: UpdateAccountRequest): Promise<Account | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/accounts/${id}`, {
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

export const getDependents = async (): Promise<Player[]> => {
    try {
        const res = await fetch("http://localhost:8080/api/accounts/dependents", {
            method: "GET",
            credentials: 'include'
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to get dependents", err);
        return [];
    }
};

export const updateAccountPicture = async (id: number, file: File): Promise<Content | null> => {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`http://localhost:8080/api/accounts/${id}/picture`, {
            method: "PATCH",
            credentials: "include",
            body: formData,
        });

        if (!res.ok) {
            console.error("Failed to upload picture", res.status, res.statusText);
            return null;
        }

        return res.json();
    } catch (err) {
        console.error("Failed to update picture", err);
        return null;
    }
};

export const deleteAccount = async (id: number) => {
    try {
        await fetch(`http://localhost:8080/api/accounts/${id}`, {
            method: "DELETE",
            credentials: 'include',
        });
        return true;
    } catch (err) {
        console.error("Failed to delete", err);
    }
    return false
};
