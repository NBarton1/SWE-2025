import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, beforeEach, expect, vi } from "vitest";
import DependentsTable from "../../../main/components/profile/DependentsTable.tsx";
import { renderWithWrap, mockNavigate, mockDependents, coachDK } from "../../../../vitest.setup.tsx";
import * as playersRequest from "../../../main/request/players";
import * as accountsRequest from "../../../main/request/accounts";

vi.mock("../../../main/components/profile/PlayerSelectModal.tsx", () => ({
    default: ({ opened, onClose, onConfirm }: any) =>
        opened ? (
            <div data-testid="player-selector-modal">
                <button data-testid="modal-confirm" onClick={() => onConfirm(1)}>Confirm</button>
                <button data-testid="modal-close" onClick={onClose}>Close</button>
            </div>
        ) : null
}));


describe("DependentsTable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders with empty dependents", async () => {
        vi.spyOn(accountsRequest, "getDependents").mockResolvedValue([]);

        renderWithWrap(<DependentsTable account={coachDK.account} />);

        await waitFor(() => {
            expect(screen.getByTestId("dependents-title")).toBeInTheDocument();
            expect(screen.getByTestId("empty-state")).toBeInTheDocument();
        });
    });

    test("renders dependents fetched from API", async () => {
        vi.spyOn(accountsRequest, "getDependents").mockResolvedValue(mockDependents);

        renderWithWrap(<DependentsTable account={coachDK.account} />);

        await waitFor(() => {
            mockDependents.forEach((dep) => {
                expect(screen.getByTestId(`dependent-${dep.account.id}`)).toBeInTheDocument();
            });
        });
    });

    test("navigates to profile when clicking on dependent row", async () => {
        vi.spyOn(accountsRequest, "getDependents").mockResolvedValue(mockDependents);

        renderWithWrap(<DependentsTable account={coachDK.account} />);

        await waitFor(() => {
            expect(screen.getByTestId("dependent-2")).toBeInTheDocument();
        });

        const user = userEvent.setup();
        await user.click(screen.getByTestId("dependent-2"));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/profile/2");
        });
    });

    test("does not navigate when clicking permission checkbox", async () => {
        vi.spyOn(accountsRequest, "getDependents").mockResolvedValue(mockDependents);
        const mockSetPermission = vi.spyOn(playersRequest, "setPlayerPermission").mockResolvedValue(true);

        renderWithWrap(<DependentsTable account={coachDK.account} />);

        await waitFor(() => {
            expect(screen.getByTestId("permission-checkbox-2")).toBeInTheDocument();
        });

        const user = userEvent.setup();
        await user.click(screen.getByTestId("permission-checkbox-2"));

        await waitFor(() => {
            expect(mockSetPermission).toHaveBeenCalledWith(2, false);
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    test("opens Add Player modal when clicking Add Player button", async () => {
        vi.spyOn(accountsRequest, "getDependents").mockResolvedValue(mockDependents);

        renderWithWrap(<DependentsTable account={coachDK.account} />);

        const user = userEvent.setup();
        const addButton = await screen.findByTestId("add-player-button");
        await user.click(addButton);

        await waitFor(() => {
            expect(screen.getByTestId("player-selector-modal")).toBeInTheDocument();
        });
    });

    test("adopts player and refreshes dependents on confirm", async () => {
        const mockGetDependents = vi
            .spyOn(accountsRequest, "getDependents")
            .mockResolvedValueOnce(mockDependents)

        const mockAdopt = vi.spyOn(playersRequest, "adoptPlayer").mockResolvedValue(mockDependents[1]);

        renderWithWrap(<DependentsTable account={coachDK.account} />);

        const user = userEvent.setup();
        const addButton = await screen.findByTestId("add-player-button");
        await user.click(addButton);

        const confirmButton = await screen.findByTestId("modal-confirm");
        await user.click(confirmButton);

        await waitFor(() => {
            expect(mockAdopt).toHaveBeenCalledWith(1);
            expect(mockGetDependents).toHaveBeenCalledTimes(2);
        });
    });

    test("adopts player close", async () => {
        const mockGetDependents = vi
            .spyOn(accountsRequest, "getDependents")
            .mockResolvedValueOnce(mockDependents)

        const mockAdopt = vi.spyOn(playersRequest, "adoptPlayer").mockResolvedValue(mockDependents[1]);

        renderWithWrap(<DependentsTable account={coachDK.account} />);

        const user = userEvent.setup();
        const addButton = await screen.findByTestId("add-player-button");
        await user.click(addButton);

        const closeButton = await screen.findByTestId("modal-close");
        await user.click(closeButton);

        await waitFor(() => {
            expect(mockAdopt).not.toHaveBeenCalled();
            expect(mockGetDependents).toHaveBeenCalledTimes(1);
        });
    });
});
