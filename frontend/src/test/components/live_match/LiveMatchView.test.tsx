import {vi} from "vitest";
import {mockLiveTimeStoppedMatch, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import {type MatchResponse} from "../../../main/types/match.ts";
import MatchView from "../../../main/components/match/MatchView.tsx";


let mockProps: {
    match: null | MatchResponse
}

describe("MatchView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("live match view components rendered for live match", async () => {
        mockProps = {
            match: mockLiveTimeStoppedMatch
        }
        renderWithWrap(<MatchView {...mockProps} navigable={false} />);

        await waitFor(() => {
            expect(screen.getByTestId(`live-match-view-${mockLiveTimeStoppedMatch.id}`)).toBeInTheDocument();
        });
    });

    test("live match update components not rendered for not live match", async () => {
        mockProps = {
            match: null
        }
        renderWithWrap(<MatchView {...mockProps} navigable={false} />);

        await waitFor(() => {
            expect(screen.queryByTestId(`live-match-view-${mockLiveTimeStoppedMatch.id}`)).not.toBeInTheDocument();
        });
    });
});
