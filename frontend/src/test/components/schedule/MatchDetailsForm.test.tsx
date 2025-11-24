import { vi } from "vitest";
import {
    mockAdminAccount,
    mockDate,
    mockMatches,
    mockPlayerAccount,
    mockTeams,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom';
import * as matchRequest from "../../../main/request/matches.ts";
import MatchDetailsForm from "../../../main/components/schedule/MatchDetailsForm.tsx";
import {Match} from "../../../main/types/match.ts";
import type {Team} from "../../../main/types/team.ts";
import React, {type Dispatch} from "react";
import * as useAuth from "../../../main/hooks/useAuth.tsx";

const mockSetMatches = vi.fn();

let mockProps: {
    match: Match;
    teams: Team[];
    date: string;
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
    setSelectedMatch: Dispatch<React.SetStateAction<Match | null>>
};


vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockPlayerAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("MatchDetailsForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            date: mockDate,
            match: mockMatches[0],
            setMatches: mockSetMatches,
            teams: mockTeams,
            setSelectedMatch: vi.fn(),
        };
    });

    test("update match form rendered", async () => {
        renderWithWrap(<MatchDetailsForm {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("update-match-form-1")).toBeInTheDocument();
        });
    });

    test("updating match test", async () => {
        vi.spyOn(matchRequest, "updateMatch").mockResolvedValue(mockMatches[0]);

        const { container } = renderWithWrap(<MatchDetailsForm {...mockProps} />);

        const form = container.querySelector('form');

        fireEvent.submit(form!);

        await waitFor(() => {
            expect(matchRequest.updateMatch).toHaveBeenCalled();
        });
    });

    test("deleting match with non admin should not be allowed", async () => {
        vi.spyOn(matchRequest, "deleteMatch").mockResolvedValue(Response.json({}));

        renderWithWrap(<MatchDetailsForm {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("match-delete-button")).not.toBeInTheDocument();
        });
    });


    test("deleting match with admin should be allowed", async () => {
        vi.spyOn(useAuth, "useAuth").mockReturnValue({ currentAccount: mockAdminAccount });

        vi.spyOn(matchRequest, "deleteMatch").mockResolvedValue(Response.json({}));

        renderWithWrap(<MatchDetailsForm {...mockProps} />);

        const deleteButton = screen.getByTestId("match-delete-button")

        fireEvent.click(deleteButton!);

        await waitFor(() => {
            expect(matchRequest.deleteMatch).toHaveBeenCalledWith(mockMatches[0].getId());
        });
    });
});
