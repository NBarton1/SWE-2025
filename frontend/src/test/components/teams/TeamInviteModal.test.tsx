import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, expect, vi} from "vitest";
import {MOCK_OK, MOCK_UNAUTHORIZED, renderWithWrap} from "../../../../vitest.setup.tsx";
import InvitePlayerModal from "../../../main/components/teams/TeamInviteModal.tsx";
import * as teamsRequest from "../../../main/request/teams.ts";
import {invitePlayerFromTeam} from "../../../main/request/teams.ts";

let mockProps: {
    opened: boolean;
    onClose: () => void;
}

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: vi.fn(() => ({ id: "1" })),
    };
});

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


describe("TeamInviteModal", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            opened: true,
            onClose: vi.fn(),
        }
    })

    test("renders", async () => {

        renderWithWrap(<InvitePlayerModal {...mockProps} />)

        await waitFor(() => {
            expect(screen.getByTestId("team-invite-modal")).toBeInTheDocument();
        })
    });

    test("inviting to team sucess", async () => {
        vi.spyOn(teamsRequest, "invitePlayerFromTeam")
                 .mockResolvedValue(MOCK_OK);

        renderWithWrap(<InvitePlayerModal {...mockProps} />)

        await waitFor(() => {
            expect(screen.getByTestId("team-invite-modal")).toBeInTheDocument();
            expect(screen.getByTestId("player-select-submit-form")).toBeInTheDocument();
        })

        fireEvent.submit(screen.getByTestId("player-select-submit-form"))

        await waitFor(() => {
            expect(invitePlayerFromTeam).toHaveResolvedWith(MOCK_OK);
        })
    });

    test("inviting to team failure", async () => {
        vi.spyOn(teamsRequest, "invitePlayerFromTeam")
            .mockResolvedValue(MOCK_UNAUTHORIZED);

        renderWithWrap(<InvitePlayerModal {...mockProps} />)

        await waitFor(() => {
            expect(screen.getByTestId("team-invite-modal")).toBeInTheDocument();
            expect(screen.getByTestId("player-select-submit-form")).toBeInTheDocument();
        })

        fireEvent.submit(screen.getByTestId("player-select-submit-form"))

        await waitFor(() => {
            expect(invitePlayerFromTeam).toHaveResolvedWith(MOCK_UNAUTHORIZED);
        })
    });
});
