import { createContext, useContext } from "react";
import type { Account } from "../types/accountTypes";

type LoggedUserContext = {
    currentAccount: Account | null;
    setCurrentAccount:  React.Dispatch<React.SetStateAction<Account | null>>
};

export const AuthContext = createContext<LoggedUserContext | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("Context could not be retrieved");

    return ctx;
}
