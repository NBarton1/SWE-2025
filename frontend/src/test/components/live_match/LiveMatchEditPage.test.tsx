import {vi} from "vitest";
import {renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import LiveMatchEditPage from "../../../main/components/live_match/LiveMatchEditPage.tsx";


describe("LiveMatchEditPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mock("../../../main/components/live_match/live_match.ts", () => {
            return {
                live_match_websocket: vi.fn(),
            };
        });
    });

    test("live match update components rendered for live match", async () => {

        renderWithWrap(<LiveMatchEditPage />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-edit-page-container")).toBeInTheDocument();
        });
    });
});
