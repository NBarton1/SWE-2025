import {vi} from "vitest";
import {renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import MatchViewPage from "../../../main/components/match/MatchViewPage.tsx";


describe("MatchViewPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mock("../../../main/components/live_match/MatchWebSocket.ts", () => {
            return {
                live_match_websocket: vi.fn(),
            };
        });
    });

    test("live match view page components render", async () => {

        renderWithWrap(<MatchViewPage />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-view-page")).toBeInTheDocument();
        });
    });
});
