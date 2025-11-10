import {screen, waitFor} from "@testing-library/react";
import {beforeEach, expect, vi} from "vitest";
import {mockTeamDK, renderWithWrap} from "../../../../vitest.setup.tsx";
import TeamCreateModal from "../../../main/components/teams/TeamCreateModal.tsx";
import type {Team} from "../../../main/types/team.ts";
import * as teamsRequest from "../../../main/request/teams.ts";
import userEvent from "@testing-library/user-event";
import {assignCoachToTeam} from "../../../main/request/teams.ts";

let mockProps: {
    opened: boolean;
    onClose: () => void;
    onTeamCreated: (team: Team) => void;
}

vi.mock("../../../main/request/teams.ts", () => ({
    createTeam: vi.fn(),
    assignCoachToTeam: vi.fn(),
}));

describe("TeamsPage", () => {

    beforeEach(() => {
        mockProps = {
            opened: true,
            onClose: vi.fn(),
            onTeamCreated: vi.fn()
        }

        vi.clearAllMocks();
    })

    test("renders", () => {

        renderWithWrap(<TeamCreateModal {...mockProps} />)

        expect(screen.getByTestId("team-create-modal")).toBeInTheDocument();
    });


    test("Creating a team request success", async () => {

        const mockCreateTeam = vi
            .spyOn(teamsRequest, "createTeam")
            .mockResolvedValue({
                ok: true,
                json: async () => mockTeamDK,
            } as Response);

        renderWithWrap(<TeamCreateModal {...mockProps} />)

        const submitButton = screen.getByTestId("team-create-modal-submit-button");

        const user = userEvent.setup();
        await user.type(screen.getByTestId("team-create-modal-team-name"), "Donkey Kong");
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreateTeam).toBeCalled();
            expect(assignCoachToTeam).toBeCalled();
            expect(mockProps.onTeamCreated).toBeCalledWith(mockTeamDK);
        })
    });

    test("Creating a team request failure", async () => {

        const mockCreateTeam = vi
            .spyOn(teamsRequest, "createTeam")
            .mockResolvedValue({
                ok: false,
            } as Response);

        renderWithWrap(<TeamCreateModal {...mockProps} />)

        const submitButton = screen.getByTestId("team-create-modal-submit-button");

        const user = userEvent.setup();
        await user.type(screen.getByTestId("team-create-modal-team-name"), "Donkey Kong");
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreateTeam).toBeCalled();
            expect(assignCoachToTeam).not.toBeCalled();
        })
    });
});
