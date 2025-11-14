import {vi} from "vitest";
import {
    mockFinishedMatch,
    mockLiveTimeRunningMatch,
    mockScheduledMatch,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import MatchTitle from "../../../main/components/match/MatchTitle.tsx";
import type {MatchResponse} from "../../../main/types/match.ts";


let mockProps: {
    match: MatchResponse
}


describe("MatchTitle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("live match title components render", async () => {
        mockProps = {
            match: mockScheduledMatch
        }

        renderWithWrap(<MatchTitle {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("match-title")).toBeInTheDocument();
        });
    });

    test("live match scheduled title renders", async () => {
        mockProps = {
            match: mockScheduledMatch
        }

        renderWithWrap(<MatchTitle {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("match-title-scheduled")).toBeInTheDocument();
            expect(screen.queryByTestId("match-title-live")).not.toBeInTheDocument();
            expect(screen.queryByTestId("match-title-finished")).not.toBeInTheDocument();
        });
    });

    test("live match live title renders", async () => {
        mockProps = {
            match: mockLiveTimeRunningMatch
        }

        renderWithWrap(<MatchTitle {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("match-title-scheduled")).not.toBeInTheDocument();
            expect(screen.queryByTestId("match-title-live")).toBeInTheDocument();
            expect(screen.queryByTestId("match-title-finished")).not.toBeInTheDocument();
        });
    });

    test("live match finished title renders", async () => {
        mockProps = {
            match: mockFinishedMatch
        }

        renderWithWrap(<MatchTitle {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("match-title-scheduled")).not.toBeInTheDocument();
            expect(screen.queryByTestId("match-title-live")).not.toBeInTheDocument();
            expect(screen.queryByTestId("match-title-finished")).toBeInTheDocument();
        });
    });
});
