import { vi } from "vitest";
import {mockDate, mockMatches, mockTeams, renderWithWrap} from "../../../../vitest.setup.tsx";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom';
import CreateMatchForm from "../../../main/components/schedule/CreateMatchForm.tsx";
import * as matchRequest from "../../../main/request/matches.ts";
import type {Team} from "../../../main/types/team.ts";
import type {Match} from "../../../main/types/match.ts";
import React, {type Dispatch} from "react";

const mockSetMatches = vi.fn();

let mockProps: {
    teams: Team[];
    date: string;
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
}

describe("CreateMatchForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            date: mockDate,
            matches: mockMatches,
            setMatches: mockSetMatches,
            teams: mockTeams,
        };
    });

    test("create match from rendered", async () => {
        renderWithWrap(<CreateMatchForm {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("create-match-form")).toBeInTheDocument();
        });
    });

    test("create new match test", async () => {

        vi.spyOn(matchRequest, "createMatch").mockResolvedValue(mockMatches[0]);

        const { container } = renderWithWrap(<CreateMatchForm {...mockProps} />);

        const form = container.querySelector('form');

        fireEvent.submit(form!);

        await waitFor(() => {
            expect(matchRequest.createMatch).toHaveBeenCalled();
        });
    });
});
