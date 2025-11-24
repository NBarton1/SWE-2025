import {expect, vi} from "vitest";
import {mockScheduledMatchResponse, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import {type MatchResponse} from "../../../main/types/match.ts";
import type {UpdateMatchRequest} from "../../../main/request/matches.ts";
import MatchEditState from "../../../main/components/match/MatchEditState.tsx";


let mockProps: {
    match: MatchResponse
    updateMatch: (req: UpdateMatchRequest) => void
}

describe("LiveMatchEditState", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            match: mockScheduledMatchResponse,
            updateMatch: vi.fn()
        }

        renderWithWrap(<MatchEditState {...mockProps} />);
    });

    test("live match edit state components render", async () => {
        await waitFor(() => {
            expect(screen.getByTestId("match-edit-state")).toBeInTheDocument();
            expect(screen.getByTestId("match-edit-state-label")).toBeInTheDocument();
            expect(screen.getByTestId("match-edit-state-select")).toBeInTheDocument();
        });
    });

    test("live match edit state select to have correct values", async () => {

        const scheduledOption = screen.queryByText("SCHEDULED")?.parentElement;
        const liveOption = screen.queryByText("LIVE")?.parentElement;
        const finishedOption = screen.queryByText("FINISHED")?.parentElement;

        expect(scheduledOption).toHaveAttribute('aria-selected', 'true');
        expect(liveOption).toHaveAttribute('aria-selected', 'false');
        expect(finishedOption).toHaveAttribute('aria-selected', 'false');
    });
});
