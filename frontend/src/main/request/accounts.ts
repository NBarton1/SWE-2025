import {type Account, Role} from "../types/accountTypes.ts";
import type {Content} from "@tiptap/react";


export interface UpdateAccountRequest {
    name?: string,
    username?: string,
    email?: string | null
    role?: Role
    password?: string
}

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
        console.error("Failed to get users", err);
        return null;
    }
};

export const updateAccountPicture = async (file: File): Promise<Content | null> => {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`http://localhost:8080/api/accounts/picture`, {
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

export const deleteAccount = async (): Promise<Account | null> => {
    try {
        const res = await fetch(`http://localhost:8080/api/accounts`, {
            method: "DELETE",
            credentials: 'include',
        });
        return await res.json();
    } catch (err) {
        console.error("Failed to delete", err);
        return null;
    }
};


