import {vi} from "vitest";
import {
    mockLiveTimeStoppedMatch,
    mockScheduledMatch,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import type {UpdateMatchRequest} from "../../../main/request/matches.ts";
import MatchEdit from "../../../main/components/match/MatchEdit.tsx";
import type {Match} from "../../../main/types/match.ts";


const mockUpdateMatch = vi.fn();

let mockProps: {
    match: Match
    updateMatch: (req: UpdateMatchRequest) => void
}

describe("LiveMatchEdit", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("live match update components rendered for live match", async () => {
        mockProps = {
            match: mockLiveTimeStoppedMatch,
            updateMatch: mockUpdateMatch,
        };

        renderWithWrap(<MatchEdit {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-edit")).toBeInTheDocument();
            expect(screen.getByTestId("team-scores-stack")).toBeInTheDocument();
        });
    });

    test("live match update components not rendered for not live match", async () => {
        mockProps = {
            match: mockScheduledMatch,
            updateMatch: mockUpdateMatch,
        };

        renderWithWrap(<MatchEdit {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-edit")).toBeInTheDocument();
            expect(screen.queryByTestId("team-scores-stack")).not.toBeInTheDocument();

        });
    });
});
