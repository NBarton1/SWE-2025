import {vi} from "vitest";
import {mockLiveTimeStoppedMatch, mockLiveTimeStoppedMatchResponse, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import {Match} from "../../../main/types/match.ts";
import MatchView from "../../../main/components/match/MatchView.tsx";


let mockProps: {
    match: Match
}

describe("MatchView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("match view components rendered", async () => {
        mockProps = {
            match: mockLiveTimeStoppedMatch
        }
        renderWithWrap(<MatchView {...mockProps} navigable={false} />);

        await waitFor(() => {
            expect(screen.getByTestId(`live-match-view-${mockLiveTimeStoppedMatchResponse.id}`)).toBeInTheDocument();
        });
    });
});
