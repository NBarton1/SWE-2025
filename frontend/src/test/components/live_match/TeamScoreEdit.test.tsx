import {expect, vi} from "vitest";
import {mockTeams, renderWithWrap} from "../../../../vitest.setup.tsx";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import TeamScoreEdit from "../../../main/components/match/TeamScoreEdit.tsx";
import type {Team} from "../../../main/types/team.ts";
import userEvent from "@testing-library/user-event";


let mockProps: {
    team: Team
    score: number
    updateScore: (score: number) => void
}

describe("LiveMatchEdit", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            team: mockTeams[0],
            score: 16,
            updateScore: vi.fn()
        }

        renderWithWrap(<TeamScoreEdit {...mockProps} />);
    });

    test("team score edit components render", async () => {

        await waitFor(() => {
            expect(screen.getByTestId("team-score-edit")).toBeInTheDocument();
            expect(screen.getByTestId("touchdown-button")).toBeInTheDocument();
            expect(screen.getByTestId("extra-point-button")).toBeInTheDocument();
            expect(screen.getByTestId("2pt-button")).toBeInTheDocument();
            expect(screen.getByTestId("field-goal-button")).toBeInTheDocument();
            expect(screen.getByTestId("safety-button")).toBeInTheDocument();
        });
    });

    test("point buttons correctly add to score", async () => {

        const touchdown_button = screen.getByTestId("touchdown-button");
        fireEvent.click(touchdown_button);
        expect(mockProps.updateScore).toHaveBeenNthCalledWith(1, mockProps.score + 6);

        const extra_point_button = screen.getByTestId("extra-point-button");
        fireEvent.click(extra_point_button);
        expect(mockProps.updateScore).toHaveBeenNthCalledWith(2, mockProps.score + 1);

        const two_point_button = screen.getByTestId("2pt-button");
        fireEvent.click(two_point_button);
        expect(mockProps.updateScore).toHaveBeenNthCalledWith(3, mockProps.score + 2);

        const field_goal_button = screen.getByTestId("field-goal-button");
        fireEvent.click(field_goal_button);
        expect(mockProps.updateScore).toHaveBeenNthCalledWith(4, mockProps.score + 3);

        const safety_button = screen.getByTestId("safety-button");
        fireEvent.click(safety_button);
        expect(mockProps.updateScore).toHaveBeenNthCalledWith(5, mockProps.score + 2);
    });

    test("directly editing score", async () => {

        const score_input = screen.getByTestId("score-input");

        await userEvent.clear(score_input);
        await userEvent.type(score_input, "45");

        expect(mockProps.updateScore).toHaveBeenCalledWith(45);
    });
});
