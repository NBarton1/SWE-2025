import {screen, waitFor} from "@testing-library/react";
import {beforeEach, vi} from "vitest";
import {mockPlayerAccount, mockTeams, renderWithWrap} from "../../../../vitest.setup.tsx";
import TeamsStandings from "../../../main/components/teams/TeamStandings.tsx";
import * as teamsRequest from "../../../main/request/teams.ts";


vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockPlayerAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("TeamsPage", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test("renders", () => {

        renderWithWrap(<TeamsStandings/>)
        expect(screen.getByTestId("teams-title")).toBeInTheDocument();
        expect(screen.getByTestId("teams-table")).toBeInTheDocument();
    });


    test("renders with teams", async () => {

        const mockGetTeams = vi.spyOn(teamsRequest, "getTeams").mockResolvedValue(mockTeams);

        renderWithWrap(<TeamsStandings/>)

        await waitFor(() => {
            expect(mockGetTeams).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByTestId("teams-title")).toBeInTheDocument();
            expect(screen.getByTestId("teams-table")).toBeInTheDocument();

            expect(screen.getByText("DK")).toBeInTheDocument();
            expect(screen.getByText("Chickens")).toBeInTheDocument();
            expect(screen.getByText("Eagles")).toBeInTheDocument();
        });
    });
});