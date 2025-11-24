import { useAuth } from "./useAuth";
import {useNavigate} from "react-router";
import {useCallback} from "react";

export const useLogout = () => {
    const { setCurrentAccount } = useAuth();
    const navigate = useNavigate()

    const logout = useCallback(async () => {
        try {
            await fetch("http://localhost:8080/api/accounts/logout", {
                method: "POST",
                credentials: "include"
            });

            setCurrentAccount(null);
            sessionStorage.removeItem("account_id");
            navigate("/login")
        } catch (err) {
            console.error("Logout failed", err);
        }
    }, [navigate, setCurrentAccount]);

    return { logout };
};
