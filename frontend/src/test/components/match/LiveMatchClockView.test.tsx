import {vi} from "vitest";
import {
    mockLiveTimeRunningMatchResponse,
    mockLiveTimeStoppedMatchResponse,
    mockScheduledMatchResponse,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import {Match} from "../../../main/types/match.ts";
import LiveMatchClockView from "../../../main/components/match/LiveMatchClockView.tsx";


let mockProps: {
    match: Match
}

describe("LiveMatchClockView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("live match clock view renders", async () => {
        mockProps = {
            match: new Match(mockLiveTimeStoppedMatchResponse),
        };

        renderWithWrap(<LiveMatchClockView {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-clock-view")).toBeInTheDocument();
        });
    });

    test("clock not rendered if match not live", async () => {
        mockProps = {
            match: new Match(mockScheduledMatchResponse),
        };

        renderWithWrap(<LiveMatchClockView {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("live-match-clock-view")).not.toBeInTheDocument();
        });
    });

    test("live match clock stopped", async () => {
        mockProps = {
            match: new Match(mockLiveTimeStoppedMatchResponse),
        };

        renderWithWrap(<LiveMatchClockView {...mockProps} />);

        const timeRemaining = screen.getByTestId("live-match-time-remaining");

        expect(timeRemaining).toHaveStyle({ color: "var(--mantine-color-gray-text)" });
    });

    test("live match clock running", async () => {
        mockProps = {
            match: new Match(mockLiveTimeRunningMatchResponse),
        };

        renderWithWrap(<LiveMatchClockView {...mockProps} />);

        const timeRemaining = screen.getByTestId("live-match-time-remaining");

        expect(timeRemaining).toHaveStyle({ color: "var(--mantine-color-green-text)" });
    });
});
