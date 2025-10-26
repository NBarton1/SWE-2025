import { vi } from "vitest";
import {renderWithWrap} from "../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import DatePopup from "../main/schedule/DatePopup.tsx";
import type {Team} from "../main/schedule/team.ts";
import {type Match, MatchType} from "../main/schedule/match.ts";
import '@testing-library/jest-dom';

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
let mockProps: DatePopupProps;

describe("DatePopup", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            date: "2024-03-14",
            matches: mockMatches,
            setMatches: mockSetMatches,
            teams: mockTeams,
        };
    });

    test("date popup display", async () => {
        renderWithWrap(<DatePopup {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("date-popup-stack")).toBeInTheDocument();
        });
    });

    test("date popup not displayed if no date clicked", async () => {
        mockProps.date = undefined;

        renderWithWrap(<DatePopup {...mockProps} />);

        expect(screen.queryByTestId("date-popup-stack")).not.toBeInTheDocument();
    });

    test("update match form displayed", async () => {
        renderWithWrap(<DatePopup {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("update-match-form-1")).toBeInTheDocument();
        });
    });
});
