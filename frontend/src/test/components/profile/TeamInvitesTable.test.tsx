import {beforeEach, expect, vi} from "vitest";
import {mockPlayerAccount, mockTeamInvite, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import TeamInvitesTable from "../../../main/components/profile/TeamInvitesTable.tsx";
import type {Account} from "../../../main/types/accountTypes.ts";


vi.mock("../../../main/request/invites.ts", () => {
    return {
        getInvites: vi.fn().mockResolvedValue([mockTeamInvite]),
    };
})

let mockProps: {
    account: Account
}

describe("TeamInvitesTable", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            account: mockPlayerAccount
        }
    })

    test("renders", async () => {

        renderWithWrap(<TeamInvitesTable {...mockProps} />)

        await waitFor(() => {
            expect(screen.getByTestId("team-invites-table")).toBeInTheDocument();
        })
    });

    test("renders invite table", async () => {

        renderWithWrap(<TeamInvitesTable {...mockProps} />)

        await waitFor(() => {
            expect(screen.getByTestId("team-invites-table")).toBeInTheDocument();
        })

        await waitFor(() => {
            expect(screen.getByTestId(`team-invitation-${mockTeamInvite.team.id}-${mockTeamInvite.player.account.id}`)).toBeInTheDocument();
        })
    });
});
