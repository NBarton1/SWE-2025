import { vi } from "vitest";
import {mockDate, mockMatches, mockTeams, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import DatePopup from "../../../main/components/schedule/DatePopup.tsx";
import '@testing-library/jest-dom';
import type {MatchResponse} from "../../../main/types/match.ts";
import React, {type Dispatch} from "react";
import type {Team} from "../../../main/types/team.ts";

const mockSetMatches = vi.fn();

global.ResizeObserver = vi.fn().mockImplementation(function(this: any) {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
});

let mockProps: {
    date: string | null;
    matches: MatchResponse[];
    setMatches: Dispatch<React.SetStateAction<MatchResponse[]>>;
    teams: Team[];
};

describe("DatePopup", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            date: mockDate,
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
        mockProps.date = null;

        renderWithWrap(<DatePopup {...mockProps} />);

        expect(screen.queryByTestId("date-popup-stack")).not.toBeInTheDocument();
    });

    test("update match form displayed", async () => {
        renderWithWrap(<DatePopup {...mockProps} />);

        screen.debug(undefined, Infinity);

        await waitFor(() => {
            for (let i = 1; i <= mockMatches.length; i++) {
                expect(screen.getByTestId(`update-match-form-${i}`)).toBeInTheDocument();
            }
        });
    });
});
