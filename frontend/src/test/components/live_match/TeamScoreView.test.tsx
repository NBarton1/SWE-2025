import {expect, vi} from "vitest";
import {mockTeams, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import type {Team} from "../../../main/types/team.ts";
import TeamScoreView from "../../../main/components/live_match/TeamScoreView.tsx";


let mockProps: {
    team: Team
    score: number
}

describe("TeamScoreView", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            team: mockTeams[0],
            score: 16,
        }

        renderWithWrap(<TeamScoreView {...mockProps} />);
    });

    test("team score view components render", async () => {

        await waitFor(() => {
            expect(screen.getByTestId("team-score-view")).toBeInTheDocument();
            expect(screen.getByTestId("team-name")).toBeInTheDocument();
            expect(screen.getByTestId("team-score")).toBeInTheDocument();
        });
    });

    test("team score view components have correct values", async () => {

        expect(screen.getByTestId("team-name").textContent).toBe(mockProps.team.name);
        expect(screen.getByTestId("team-score").textContent).toBe(mockProps.score.toString());
    });
});
