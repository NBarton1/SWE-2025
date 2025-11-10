import {screen, waitFor} from "@testing-library/react";
import {beforeEach, expect, vi} from "vitest";
import {coachDK, mockAdminAccount, mockPlayer, mockTeamDK, renderWithWrap} from "../../../../vitest.setup.tsx";
import TeamView from "../../../main/components/teams/TeamView.tsx";
import userEvent from "@testing-library/user-event";
import * as teamsRequest from "../../../main/request/teams.ts";
import {removePlayerFromTeam} from "../../../main/request/teams.ts";


vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: vi.fn(() => ({ id: "1" })),
    };
});

vi.mock("../../../main/hooks/useLogin.tsx", () => ({
    default: vi.fn(() => ({
        currentAccount: mockAdminAccount,
    })),
}));

vi.mock("../../../main/request/teams.ts", () => ({
    getTeam: vi.fn().mockResolvedValue(mockTeamDK),
    getTeamPlayers: vi.fn().mockResolvedValue([mockPlayer]),
    getTeamCoaches: vi.fn().mockResolvedValue([coachDK]),
    removePlayerFromTeam: vi.fn().mockResolvedValue(true),
}));

describe("TeamsPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders", async () => {

        renderWithWrap(<TeamView />);

        await waitFor(() => {
            expect(screen.getByTestId("team-view")).toBeInTheDocument();
        })
    });

    test("removing player success", async () => {

        renderWithWrap(<TeamView />);

        await waitFor(() => {
            expect(screen.getByTestId("team-view")).toBeInTheDocument();
        })

        const user = userEvent.setup();
        const removePlayerButton = screen.getByTestId("remove-player-button");
        await user.click(removePlayerButton);

        await waitFor(() => {
            expect(removePlayerFromTeam).toHaveResolvedWith(true);
        })
    });

    test("removing player failure", async () => {

        vi.spyOn(teamsRequest, "removePlayerFromTeam").mockResolvedValue(false);

        renderWithWrap(<TeamView />);

        await waitFor(() => {
            expect(screen.getByTestId("team-view")).toBeInTheDocument();
        })

        const user = userEvent.setup();
        const removePlayerButton = screen.getByTestId("remove-player-button");
        await user.click(removePlayerButton);

        await waitFor(() => {
            expect(removePlayerFromTeam).toHaveResolvedWith(false);
        })
    });
});
