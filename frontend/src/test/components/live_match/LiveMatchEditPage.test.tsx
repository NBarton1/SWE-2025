import {vi} from "vitest";
import {renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import MatchEditPage from "../../../main/components/match/MatchEditPage.tsx";


describe("MatchEditPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mock("../../../main/components/live_match/MatchWebSocket.ts", () => {
            return {
                live_match_websocket: vi.fn(),
            };
        });
    });

    test("live match update components rendered for live match", async () => {

        renderWithWrap(<MatchEditPage />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-edit-page-container")).toBeInTheDocument();
        });
    });
});
