import {vi} from "vitest";
import {renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import LiveMatchViewPage from "../../../main/components/live_match/LiveMatchViewPage.tsx";


describe("LiveMatchViewPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mock("../../../main/components/live_match/live_match.ts", () => {
            return {
                live_match_websocket: vi.fn(),
            };
        });
    });

    test("live match view page components render", async () => {

        renderWithWrap(<LiveMatchViewPage />);

        await waitFor(() => {
            expect(screen.getByTestId("live-match-view-page")).toBeInTheDocument();
        });
    });
});
