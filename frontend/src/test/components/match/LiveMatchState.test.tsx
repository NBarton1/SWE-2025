import {expect, vi} from "vitest";
import {mockLiveTimeRunningMatchResponse, renderWithWrap} from "../../../../vitest.setup.tsx";
import { screen, waitFor} from "@testing-library/react";
import { Match } from "../../../main/types/match.ts";


let liveMatch: Match;

describe("LiveMatchState", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        liveMatch = new Match(mockLiveTimeRunningMatchResponse);
    });

    test("rendering title for live match", async () => {

        renderWithWrap(
            <>
                {liveMatch.getTitleSuffix()}
            </>
        );

        await waitFor(() => {
            expect(screen.getByTestId("match-title-live")).toBeInTheDocument()
        });
    });

    test("rendering edit controls for live match", async () => {

        const updateMatchRequest = vi.fn();

        renderWithWrap(
            <>
                {liveMatch.getEditControls(updateMatchRequest)}
            </>
        );

        await waitFor(() => {
            expect(screen.getByTestId("match-edit-state")).toBeInTheDocument()
            expect(screen.queryByTestId("team-scores-stack")).toBeInTheDocument()
        });
    });
});
