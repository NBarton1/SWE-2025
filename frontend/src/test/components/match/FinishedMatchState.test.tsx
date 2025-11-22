import {expect, vi} from "vitest";
import {mockFinishedMatchResponse, renderWithWrap} from "../../../../vitest.setup.tsx";
import { screen, waitFor} from "@testing-library/react";
import { Match } from "../../../main/types/match.ts";


let finishedMatch: Match;

describe("FinishedMatchState", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        finishedMatch = new Match(mockFinishedMatchResponse);
    });

    test("rendering title for finished match", async () => {

        renderWithWrap(
            <>
                {finishedMatch.getTitleSuffix()}
            </>
        );

        await waitFor(() => {
            expect(screen.getByTestId("match-title-finished")).toBeInTheDocument()
        });
    });

    test("rendering edit controls for finished match", async () => {

        const updateMatchRequest = vi.fn();

        renderWithWrap(
            <>
                {finishedMatch.getEditControls(updateMatchRequest)}
            </>
        );

        await waitFor(() => {
            expect(screen.getByTestId("match-edit-state")).toBeInTheDocument()
            expect(screen.queryByTestId("team-scores-stack")).not.toBeInTheDocument()
        });
    });
});
