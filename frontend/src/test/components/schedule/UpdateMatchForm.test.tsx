import { vi } from "vitest";
import {mockDate, mockMatches, mockTeams, renderWithWrap} from "../../../../vitest.setup.tsx";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom';
import * as matchRequest from "../../../main/request/matches.ts";
import MatchDetailsForm from "../../../main/components/schedule/MatchDetailsForm.tsx";
import type {MatchResponse} from "../../../main/types/match.ts";
import type {Team} from "../../../main/types/team.ts";
import React, {type Dispatch} from "react";

const mockSetMatches = vi.fn();

let mockProps: {
    match: MatchResponse;
    teams: Team[];
    date: string;
    matches: MatchResponse[];
    setMatches: Dispatch<React.SetStateAction<MatchResponse[]>>;
};

describe("MatchDetailsForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            date: mockDate,
            match: mockMatches[0],
            matches: mockMatches,
            setMatches: mockSetMatches,
            teams: mockTeams,
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

    test("deleting match test", async () => {
        vi.spyOn(matchRequest, "deleteMatch").mockResolvedValue(Response.json({}));

        renderWithWrap(<MatchDetailsForm {...mockProps} />);

        const deleteButton = screen.getByTestId("match-delete-button")

        fireEvent.click(deleteButton!);

        await waitFor(() => {
            expect(matchRequest.deleteMatch).toHaveBeenCalledWith(mockMatches[0].id);
        });
    });
});
