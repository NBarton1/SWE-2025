import { useAuth } from "./useAuth";
import {useNavigate} from "react-router";

export const useLogout = () => {
    const { setCurrentAccount } = useAuth();
    const navigate = useNavigate()

    const logout = async () => {
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
    };

    return { logout };
};
