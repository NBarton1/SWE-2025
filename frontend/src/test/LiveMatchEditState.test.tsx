import {expect, vi} from "vitest";
import {mockScheduledMatch, mockTeams, renderWithWrap} from "../../vitest.setup.tsx";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {type Match, MatchState} from "../main/types/match.ts";
import type {UpdateMatchRequest} from "../main/request/matches.ts";
import LiveMatchEditState from "../main/components/live_match/LiveMatchEditState.tsx";
import userEvent from "@testing-library/user-event";


let mockProps: {
    match: Match
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

describe("LiveMatchEditState", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            match: mockScheduledMatch,
            updateLiveMatch: vi.fn()
        }

        renderWithWrap(<LiveMatchEditState {...mockProps} />);
    });

    test("team score view components render", async () => {
        await waitFor(() => {
            expect(screen.getByTestId("match-edit-state")).toBeInTheDocument();
            expect(screen.getByTestId("match-edit-state-label")).toBeInTheDocument();
            expect(screen.getByTestId("match-edit-state-select")).toBeInTheDocument();
        });
    });

    test("team score view components have correct values", async () => {

        Element.prototype.scrollIntoView = vi.fn();


        const user = userEvent.setup();

        const selectInput = screen.getByTestId('match-edit-state-select');

        await user.click(selectInput);

        const scheduledOption = await screen.findByRole('option', { name: MatchState.SCHEDULED });
        const liveOption = await screen.findByRole('option', { name: MatchState.LIVE });
        // const finishedOption = await screen.findByRole('option', { name: MatchState.FINISHED });

        expect(scheduledOption).toBeInTheDocument();
        expect(liveOption).toBeInTheDocument();
        // expect(finishedOption).toBeInTheDocument();
    });
});
