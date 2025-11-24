import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, beforeEach, expect, vi } from "vitest";
import {
    renderWithWrap,
    mockPlayerAccount,
    mockAdminAccount,
} from "../../../../vitest.setup.tsx";
import ProfileHeader from "../../../main/components/profile/ProfileHeader.tsx";
import * as accountsRequest from "../../../main/request/accounts.ts";

vi.mock("../../../main/request/accounts.ts", () => ({
    updateAccount: vi.fn(),
    updateAccountPicture: vi.fn(),
    deleteAccount: vi.fn(),
}));

vi.mock("../../../main/request/auth.ts", () => ({
    logout: vi.fn(),
}));

vi.mock("../../../main/hooks/useLogout.tsx", () => ({
    useLogout: vi.fn().mockReturnValue({ logout: vi.fn() })
}));

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: null,
        setCurrentAccount: vi.fn()
    })
}));

describe("ProfileHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders correctly for null account", () => {
        renderWithWrap(
            <ProfileHeader
                account={null}
                setAccount={vi.fn()}
            />
        );

        expect(screen.getByTestId("no-account")).toBeInTheDocument();
    });

    test("renders account information when provided", async () => {
        const { useAuth } = await import("../../../main/hooks/useAuth.tsx");
        vi.mocked(useAuth).mockReturnValue({
            currentAccount: mockPlayerAccount,
            setCurrentAccount: vi.fn()
        });

        renderWithWrap(
            <ProfileHeader
                account={mockPlayerAccount}
                setAccount={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId("account-name")).toBeInTheDocument();
            expect(screen.getByTestId("account-name")).toHaveTextContent(mockPlayerAccount.name);
            expect(screen.getByTestId("account-username")).toHaveTextContent(`@${mockPlayerAccount.username}`);
            expect(screen.getByTestId("account-role")).toHaveTextContent(mockPlayerAccount.role);
        });
    });

    test("enters edit mode when clicking Edit Profile", async () => {
        const { useAuth } = await import("../../../main/hooks/useAuth.tsx");
        vi.mocked(useAuth).mockReturnValue({
            currentAccount: mockPlayerAccount,
            setCurrentAccount: vi.fn()
        });

        renderWithWrap(
            <ProfileHeader
                account={mockPlayerAccount}
                setAccount={vi.fn()}
            />
        );

        const editButton = await screen.findByTestId("edit-profile-button");
        await userEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByTestId("form-name")).toBeInTheDocument();
            expect(screen.getByTestId("form-username")).toBeInTheDocument();
            expect(screen.getByTestId("save-button")).toBeInTheDocument();
            expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
        });
    });

    test("cancel button exits edit mode", async () => {
        const { useAuth } = await import("../../../main/hooks/useAuth.tsx");
        vi.mocked(useAuth).mockReturnValue({
            currentAccount: mockPlayerAccount,
            setCurrentAccount: vi.fn()
        });

        renderWithWrap(
            <ProfileHeader
                account={mockPlayerAccount}
                setAccount={vi.fn()}
            />
        );

        const editButton = await screen.findByTestId("edit-profile-button");
        await userEvent.click(editButton);

        const cancelButton = screen.getByTestId("cancel-button");
        await userEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.getByTestId("account-name")).toHaveTextContent(mockPlayerAccount.name);
            expect(screen.queryByTestId("form-name")).not.toBeInTheDocument();
        });
    });

    test("submits edited profile successfully", async () => {
        const { useAuth } = await import("../../../main/hooks/useAuth.tsx");
        vi.mocked(useAuth).mockReturnValue({
            currentAccount: mockPlayerAccount,
            setCurrentAccount: vi.fn()
        });

        const mockSetAccount = vi.fn();
        vi.mocked(accountsRequest.updateAccount).mockResolvedValue({
            ...mockPlayerAccount,
            name: "Updated Name",
        });

        renderWithWrap(
            <ProfileHeader
                account={mockPlayerAccount}
                setAccount={mockSetAccount}
            />
        );

        const user = userEvent.setup();

        await user.click(await screen.findByTestId("edit-profile-button"));

        const nameInput = screen.getByTestId("form-name");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Name");

        await user.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(accountsRequest.updateAccount).toHaveBeenCalledWith(
                mockPlayerAccount.id,
                expect.objectContaining({ name: "Updated Name" })
            );
            expect(mockSetAccount).toHaveBeenCalledWith(
                expect.objectContaining({ name: "Updated Name" })
            );
        });
    });

    test("does not log out if deleting another user (admin deletes player)", async () => {
        const { useAuth } = await import("../../../main/hooks/useAuth.tsx");
        const { useLogout } = await import("../../../main/hooks/useLogout.tsx");

        const mockLogout = vi.fn();
        vi.mocked(useLogout).mockReturnValue({ logout: mockLogout });
        vi.mocked(useAuth).mockReturnValue({
            currentAccount: mockAdminAccount,
            setCurrentAccount: vi.fn()
        });

        const mockSetAccount = vi.fn();
        vi.mocked(accountsRequest.deleteAccount).mockResolvedValue(true);

        renderWithWrap(
            <ProfileHeader
                account={mockPlayerAccount}
                setAccount={mockSetAccount}
            />
        );

        const user = userEvent.setup();
        await user.click(await screen.findByTestId("edit-profile-button"));

        const deleteButton = screen.getByTestId("delete-account-button");
        await user.click(deleteButton);

        await waitFor(() => {
            expect(mockLogout).not.toHaveBeenCalled();
            expect(mockSetAccount).toHaveBeenCalledWith(null);
        });
    });
});