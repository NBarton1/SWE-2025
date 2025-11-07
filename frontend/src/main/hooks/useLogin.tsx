import {useCallback, useEffect, useState} from "react";
import {login} from "../request/auth.ts";
import {useNavigate} from "react-router";
import {getAccount} from "../request/accounts.ts";
import type {Account} from "../types/accountTypes.ts";

const useLogin = () => {

    const navigate = useNavigate()

    const [currentAccount, setCurrentAccount] = useState<Account | null>(null)

    useEffect(() => {
        const idString = sessionStorage.getItem("account_id")
        const accountId = Number(idString)
        if (isNaN(accountId)) return
        getAccount(accountId).then(setCurrentAccount)
    }, []);

    const tryLogin = useCallback(async (username: string, password: string) => {
        const res = await login({
            username,
            password,
        });

        if (!res.ok) {
            return;
        }

        const idString = await res.text()
        const accountId = Number(idString)
        if (isNaN(accountId)) return
        sessionStorage.setItem("account_id", idString)
        getAccount(accountId).then(setCurrentAccount)

        navigate("/teams")

    }, [navigate])

    return { currentAccount, tryLogin }
}


export default useLogin;