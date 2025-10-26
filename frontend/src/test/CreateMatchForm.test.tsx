import { vi } from "vitest";
import {renderWithWrap} from "../../vitest.setup.tsx";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import type {Team} from "../main/schedule/team.ts";
import {type Match, MatchType} from "../main/schedule/match.ts";
import '@testing-library/jest-dom';
import CreateMatchForm from "../main/schedule/CreateMatchForm.tsx";
import * as matchRequest from "../main/request/matches.ts";

const mockTeams: Team[] = [
    { id: 1, name: "Home Team" } as Team,
    { id: 2, name: "Away Team" } as Team,
];

const mockMatches: Match[] = [
    {
        id: 1,
        type: MatchType.STANDARD,
        date: "2024-03-14T03:00",
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1]
    }
];

const mockSetMatches = vi.fn();

global.ResizeObserver = vi.fn().mockImplementation(function(this: any) {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
});

// @ts-ignore
let mockProps: CreateMatchFormProps;

describe("CreateMatchForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            date: "2024-03-14",
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

    test("create match from rendered1", async () => {
        const mockCreatedMatch: Match = {
            id: 1,
            type: "regular",
            date: "2024-03-15",
            homeTeam: { id: 1, name: "Team A" } as Team,
            awayTeam: { id: 2, name: "Team B" } as Team,
        };

        vi.spyOn(matchRequest, "createMatch").mockResolvedValue(mockCreatedMatch);

        renderWithWrap(<CreateMatchForm {...mockProps} />);

        const { container } = renderWithWrap(<CreateMatchForm {...mockProps} />);

        const form = container.querySelector('form');

        fireEvent.submit(form!);

        await waitFor(() => {
            expect(matchRequest.createMatch).toHaveBeenCalled();
        });
    });
});
