import {vi} from "vitest";
import {mockAdminAccount, mockScheduledMatch, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import MatchPage from "../../../main/components/match/MatchPage.tsx";
import {createMatchWebsocket} from "../../../main/components/match/MatchWebSocket.ts";
import type {Match} from "../../../main/types/match.ts";

vi.mock("../../../main/components/match/MatchWebSocket.ts", () => {
    return {
        createMatchWebsocket: vi.fn(),
        updateMatchCallback: vi.fn(() => vi.fn()),
    };
});

describe("MatchPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("view not rendered for invalid match", async () => {

        renderWithWrap(<MatchPage />);

        await waitFor(() => {
            expect(screen.queryByTestId("match-view-page")).not.toBeInTheDocument();
        });
    });

    test("view rendered for valid match", async () => {
        vi.mock("../../../main/hooks/useAuth.tsx", () => {
            return {
                useAuth: vi.fn().mockReturnValue({ currentAccount: mockAdminAccount }),
            };
        });
        
        // @ts-ignore mockImplementation for createMatchWebsocket
        createMatchWebsocket.mockImplementation((_matchId: any, setMatch: (match: Match) => void) => {
            setMatch(mockScheduledMatch);
            return () => {};
        });

        renderWithWrap(<MatchPage />);

        await waitFor(() => {
            expect(screen.queryByTestId("match-view-page")).toBeInTheDocument();
        });
    });
});