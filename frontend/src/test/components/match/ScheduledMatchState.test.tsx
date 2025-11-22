import {expect, vi} from "vitest";
import { mockScheduledMatchResponse, renderWithWrap} from "../../../../vitest.setup.tsx";
import { screen, waitFor} from "@testing-library/react";
import { Match } from "../../../main/types/match.ts";


let scheduledMatch: Match;

describe("ScheduledMatchState", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        scheduledMatch = new Match(mockScheduledMatchResponse);
    });

    test("rendering title for scheduled match", async () => {

        renderWithWrap(
            <>
                {scheduledMatch.getTitleSuffix()}
            </>
        );

        await waitFor(() => {
            expect(screen.getByTestId("match-title-scheduled")).toBeInTheDocument()
        });
    });

    test("rendering edit controls for scheduled match", async () => {

        const updateMatchRequest = vi.fn();

        renderWithWrap(
            <>
                {scheduledMatch.getEditControls(updateMatchRequest)}
            </>
        );

        await waitFor(() => {
            expect(screen.getByTestId("match-edit-state")).toBeInTheDocument()
            expect(screen.queryByTestId("team-scores-stack")).not.toBeInTheDocument()
        });
    });
});
