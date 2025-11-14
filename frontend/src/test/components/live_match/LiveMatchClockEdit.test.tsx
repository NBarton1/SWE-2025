import { vi } from "vitest";
import {mockLiveTimeStoppedMatch, renderWithWrap} from "../../../../vitest.setup.tsx";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom';
import type {MatchResponse} from "../../../main/types/match.ts";
import type {UpdateMatchRequest} from "../../../main/request/matches.ts";
import LiveMatchClockEdit from "../../../main/components/match/LiveMatchClockEdit.tsx";

const mockUpdateLiveMatch = vi.fn();

let mockProps: {
    match: MatchResponse
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

describe("LiveMatchClockEdit", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            match: mockLiveTimeStoppedMatch,
            updateLiveMatch: mockUpdateLiveMatch,
        };
    });

    test("live match clock editor renders", async () => {
        renderWithWrap(<LiveMatchClockEdit {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-clock-edit")).toBeInTheDocument();
        });
    });

    test("submit time button appears", async () => {
        renderWithWrap(<LiveMatchClockEdit {...mockProps} />);

        const timeButton = screen.getByTestId("set-time-button");
        fireEvent.click(timeButton);

        await waitFor(() => {
            expect(screen.getByTestId("submit-time-button")).toBeInTheDocument();
        });
    });

    test("new match time submitted", async () => {
        renderWithWrap(<LiveMatchClockEdit {...mockProps} />);

        const setTimeButton = screen.getByTestId("set-time-button");
        fireEvent.click(setTimeButton);

        const submitTimeButton = screen.getByTestId("submit-time-button");
        fireEvent.click(submitTimeButton);

        await waitFor(() => {
            expect(mockUpdateLiveMatch).toHaveBeenCalled();
        });
    });

    test("new match time submitted with correct time", async () => {
        renderWithWrap(<LiveMatchClockEdit {...mockProps} />);

        const timeButton = screen.getByTestId("set-time-button");
        fireEvent.click(timeButton);

        const minutes = screen.getByTestId("live-match-clock-edit-minutes");
        fireEvent.change(minutes, { target: { value: "1" } });

        const seconds = screen.getByTestId("live-match-clock-edit-seconds");
        fireEvent.change(seconds, { target: { value: "1" } });

        const submitTimeButton = screen.getByTestId("submit-time-button");
        fireEvent.click(submitTimeButton);

        await waitFor(() => {
            expect(mockUpdateLiveMatch).toHaveBeenCalledWith({ timeLeft: 61 });
        });
    });

    test("toggling clock", async () => {
        renderWithWrap(<LiveMatchClockEdit {...mockProps} />);

        const toggleClockButton = screen.getByTestId("toggle-clock-button");
        fireEvent.click(toggleClockButton);

        await waitFor(() => {
            expect(mockUpdateLiveMatch).toHaveBeenCalledWith( { toggleClock: true } );
        });
    });

    test("clock has correct initial value", async () => {
        renderWithWrap(<LiveMatchClockEdit {...mockProps} />);

        const minutes = screen.getByTestId("live-match-clock-edit-minutes");
        const seconds = screen.getByTestId("live-match-clock-edit-seconds");

        expect(minutes).toHaveValue("60");
        expect(seconds).toHaveValue("0");
    });
});
