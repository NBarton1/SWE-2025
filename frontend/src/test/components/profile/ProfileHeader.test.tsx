import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, beforeEach, expect, vi } from "vitest";
import ProfileHeader1 from "../../../main/components/profile/ProfileHeader1.tsx";
import {
    renderWithWrap,
    mockAdminAccount,
    mockPlayerAccount,
} from "../../../../vitest.setup.tsx";
import * as accountsRequest from "../../../main/request/accounts.ts";
import * as authRequest from "../../../main/request/auth.ts";

// Mock requests
vi.mock("../../../main/request/accounts.ts", () => ({
    updateAccount: vi.fn(),
    updateAccountPicture: vi.fn(),
    deleteAccount: vi.fn(),
}));

vi.mock("../../../main/request/auth.ts", () => ({
    logout: vi.fn(),
}));

describe("ProfileHeader1 with testids", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders correctly for null account", () => {
        renderWithWrap(
            <ProfileHeader1
                account={null}
                currentAccount={mockAdminAccount}
                setAccount={vi.fn()}
            />
        );

        expect(screen.getByTestId("no-account")).toBeInTheDocument();
    });

    test("renders account information when provided", async () => {
        renderWithWrap(
            <ProfileHeader1
                account={mockPlayerAccount}
                currentAccount={mockPlayerAccount}
                setAccount={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId("account-name")).toHaveTextContent(mockPlayerAccount.name);
            expect(screen.getByTestId("account-username")).toHaveTextContent(`@${mockPlayerAccount.username}`);
            expect(screen.getByTestId("account-role")).toHaveTextContent(mockPlayerAccount.role);
        });
    });

    test("enters edit mode when clicking Edit Profile", async () => {
        renderWithWrap(
            <ProfileHeader1
                account={mockPlayerAccount}
                currentAccount={mockPlayerAccount}
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
        renderWithWrap(
            <ProfileHeader1
                account={mockPlayerAccount}
                currentAccount={mockPlayerAccount}
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
        const mockSetAccount = vi.fn();
        const mockUpdate = vi.spyOn(accountsRequest, "updateAccount").mockResolvedValue({
            ...mockPlayerAccount,
            name: "Updated Name",
        });

        renderWithWrap(
            <ProfileHeader1
                account={mockPlayerAccount}
                currentAccount={mockPlayerAccount}
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
            expect(mockUpdate).toHaveBeenCalledWith(
                mockPlayerAccount.id,
                expect.objectContaining({ name: "Updated Name" })
            );
            expect(mockSetAccount).toHaveBeenCalledWith(expect.objectContaining({ name: "Updated Name" }));
        });
    });


    test("does not log out if deleting another user (admin deletes player)", async () => {
        const mockSetAccount = vi.fn();

        renderWithWrap(
            <ProfileHeader1
                account={mockPlayerAccount}
                currentAccount={mockAdminAccount}
                setAccount={mockSetAccount}
            />
        );

        const user = userEvent.setup();
        await user.click(await screen.findByTestId("edit-profile-button"));

        const deleteButton = screen.getByTestId("delete-account-button");
        await user.click(deleteButton);

        await waitFor(() => {
            expect(authRequest.logout).not.toHaveBeenCalled();
        });
    });
});
