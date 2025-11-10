import {vi} from "vitest";
import {
    mockLiveTimeRunningMatch,
    mockLiveTimeStoppedMatch,
    mockScheduledMatch,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import type {Match} from "../../../main/types/match.ts";
import type {UpdateMatchRequest} from "../../../main/request/matches.ts";
import LiveMatchClockView from "../../../main/components/live_match/LiveMatchClockView.tsx";

const mockUpdateLiveMatch = vi.fn();

let mockProps: {
    match: Match
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

describe("LiveMatchClockView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("live match clock view renders", async () => {
        mockProps = {
            match: mockLiveTimeStoppedMatch,
            updateLiveMatch: mockUpdateLiveMatch,
        };

        renderWithWrap(<LiveMatchClockView {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-clock-view")).toBeInTheDocument();
        });
    });

    test("clock not rendered if match not live", async () => {
        mockProps = {
            match: mockScheduledMatch,
            updateLiveMatch: mockUpdateLiveMatch,
        };

        renderWithWrap(<LiveMatchClockView {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("live-match-clock-view")).not.toBeInTheDocument();
        });
    });

    test("live match clock stopped", async () => {
        mockProps = {
            match: mockLiveTimeStoppedMatch,
            updateLiveMatch: mockUpdateLiveMatch,
        };

        renderWithWrap(<LiveMatchClockView {...mockProps} />);

        const timeRemaining = screen.getByTestId("live-match-time-remaining");

        expect(timeRemaining).toHaveStyle({ color: "var(--mantine-color-gray-text)" });
    });

    test("live match clock running", async () => {
        mockProps = {
            match: mockLiveTimeRunningMatch,
            updateLiveMatch: mockUpdateLiveMatch,
        };

        renderWithWrap(<LiveMatchClockView {...mockProps} />);

        const timeRemaining = screen.getByTestId("live-match-time-remaining");

        expect(timeRemaining).toHaveStyle({ color: "var(--mantine-color-green-text)" });
    });
});
