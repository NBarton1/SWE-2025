import { useCallback } from "react";
import { useNavigate } from "react-router";
import { getAccount } from "../request/accounts.ts";
import { useAuth } from "./useAuth.tsx";

export const useLogin = () => {
    const navigate = useNavigate();
    const { setCurrentAccount } = useAuth();

    const tryLogin = useCallback(async (username: string, password: string) => {
        const res = await fetch("http://localhost:8080/api/accounts/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password}),
        });

        if (!res.ok)
            return false;

        const idString = await res.text();
        const accountId = Number(idString);

        if (isNaN(accountId))
            return false;

        sessionStorage.setItem("account_id", idString);

        const account = await getAccount(accountId);
        setCurrentAccount(account);

        navigate("/feed");

        return true;
    }, [navigate, setCurrentAccount]);

    return { tryLogin };
};
