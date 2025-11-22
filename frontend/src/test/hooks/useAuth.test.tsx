import { renderHook } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import {AuthContext, useAuth} from "../../main/hooks/useAuth.tsx";
import {mockAdminAccount} from "../../../vitest.setup.tsx";
import type {ReactNode} from "react";
import type {Account} from "../../main/types/accountTypes.ts";


interface MockContext {
    currentAccount: Account | null,
    setCurrentAccount: React.Dispatch<React.SetStateAction<Account | null>>
}

const mockSetCurrentAccount = vi.fn();

const wrapperWithMockContext = (mockContext: MockContext) => {
    return ({ children }: { children: ReactNode }) => (
        <AuthContext.Provider value={mockContext}>
            {children}
        </AuthContext.Provider>
    );
}

describe("useAuth", () => {
    test("throws error when used outside AuthContext provider", () => {

        expect(() => {
            renderHook(() => useAuth());
        }).toThrow();
    });

    test("account returned when logged in", () => {

        const mockContext = {
            currentAccount: mockAdminAccount,
            setCurrentAccount: mockSetCurrentAccount
        };

        const { result } = renderHook(() => useAuth(),
            { wrapper: wrapperWithMockContext(mockContext) }
        );

        expect(result.current.currentAccount).toBe(mockAdminAccount);
        expect(result.current.setCurrentAccount).toBe(mockSetCurrentAccount);
    });

    test("account null when not logged in", () => {

        const mockContext = {
            currentAccount: null,
            setCurrentAccount: mockSetCurrentAccount
        };

        const { result } = renderHook(() => useAuth(),
            { wrapper: wrapperWithMockContext(mockContext) }
        );
        expect(result.current.currentAccount).toBeNull();
        expect(result.current.setCurrentAccount).toBe(mockSetCurrentAccount);
    });
});
