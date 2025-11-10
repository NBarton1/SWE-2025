import {vi} from "vitest";
import {mockLiveTimeStoppedMatch, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import {type Match} from "../../../main/types/match.ts";
import LiveMatchView from "../../../main/components/live_match/LiveMatchView.tsx";


let mockProps: {
    match: null | Match
}

describe("LiveMatchView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("live match view components rendered for live match", async () => {
        mockProps = {
            match: mockLiveTimeStoppedMatch
        }
        renderWithWrap(<LiveMatchView {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-view")).toBeInTheDocument();
        });
    });

    test("live match update components not rendered for not live match", async () => {
        mockProps = {
            match: null
        }
        renderWithWrap(<LiveMatchView {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("live-match-view")).not.toBeInTheDocument();
        });
    });
});
