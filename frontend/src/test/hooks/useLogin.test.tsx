import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import type {ReactNode} from "react";
import {mockAdminAccount} from "../../../vitest.setup.tsx";
import {useLogin} from "../../main/hooks/useLogin.tsx";
import * as accountsRequest from '../../main/request/accounts';
import { AuthContext } from "../../main/hooks/useAuth";

const mockNavigate = vi.fn();
const mockSetCurrentAccount = vi.fn();

vi.mock("react-router", () => ({
    useNavigate: () => mockNavigate
}));

global.fetch = vi.fn();

const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={{
        currentAccount: null,
        setCurrentAccount: mockSetCurrentAccount
    }}>
        {children}
    </AuthContext.Provider>
);

describe("useLogin", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    test("login request fail", async () => {
        // @ts-ignore
        global.fetch.mockResolvedValue({
            ok: false
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        const success = await result.current.tryLogin("", "");

        await waitFor(() => {
            expect(success).toBe(false);
            expect(mockSetCurrentAccount).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(sessionStorage.getItem("account_id")).toBeNull();
        })
    });

    test("account id stored in session storage", async () => {
        vi.spyOn(accountsRequest, "getAccount").mockResolvedValue(mockAdminAccount);

        // @ts-ignore
        global.fetch.mockResolvedValue({
            ok: true,
            text: async () => "1"
        });

        const { result } = renderHook(() => useLogin(), { wrapper });

        await result.current.tryLogin("", "");

        await waitFor(() => {
            expect(sessionStorage.getItem("account_id")).toBe("1");
        });
    });
});
