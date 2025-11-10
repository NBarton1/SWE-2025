import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, expect, vi} from "vitest";
import {MOCK_OK, MOCK_UNAUTHORIZED, renderWithWrap} from "../../../../vitest.setup.tsx";
import * as teamsRequest from "../../../main/request/teams.ts";
import TeamInviteModal from "../../../main/components/teams/TeamInviteModal.tsx";
import {invitePlayerFromTeam} from "../../../main/request/teams.ts";


let mockProps: {
    opened: boolean;
    onClose: () => void;
}

vi.mock("../../../main/request/teams.ts", () => ({
    invitePlayerFromTeam: vi.fn(),
}));

vi.mock("@mantine/form", () => ({
    useForm: vi.fn().mockReturnValue({
        values: {
            playerId: "1"
        },
        getInputProps: vi.fn(),
        reset: vi.fn(),
        onSubmit: (submitHandler: any) => (_: any) => {
            return submitHandler();
        },
    } as any),
}));


describe("TeamsPage", () => {

    beforeEach(() => {
        mockProps = {
            opened: true,
            onClose: vi.fn(),
        }

        vi.clearAllMocks();
    })

    test("renders", () => {

        renderWithWrap(<TeamInviteModal {...mockProps} />)

        expect(screen.getByTestId("team-invite-modal")).toBeInTheDocument();
    });

    test("Inviting to team success", async () => {

        vi.spyOn(teamsRequest, "invitePlayerFromTeam")
            .mockResolvedValue(MOCK_OK);

        renderWithWrap(<TeamInviteModal {...mockProps} />)

        fireEvent.submit(screen.getByTestId("team-invite-modal-form"))

        await waitFor(() => {
            expect(invitePlayerFromTeam).toBeCalledWith(1);
            expect(mockProps.onClose).toBeCalled();
        })
    });

    test("Inviting to team failure", async () => {

        vi.spyOn(teamsRequest, "invitePlayerFromTeam")
            .mockResolvedValue(MOCK_UNAUTHORIZED);

        renderWithWrap(<TeamInviteModal {...mockProps} />)

        fireEvent.submit(screen.getByTestId("team-invite-modal-form"))

        await waitFor(() => {
            expect(invitePlayerFromTeam).toBeCalledWith(1);
            expect(mockProps.onClose).not.toBeCalled();
        })
    });
});
