import {screen, waitFor} from "@testing-library/react";
import {beforeEach, vi} from "vitest";
import {mockTeams, renderWithWrap} from "../../../../vitest.setup.tsx";
import TeamsPage from "../../../main/components/teams/TeamStandings.tsx";
import * as teamsRequest from "../../../main/request/teams.ts";


describe("TeamsPage", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })



    test("renders", () => {

        renderWithWrap(<TeamsPage/>)
        expect(screen.getByTestId("teams-title")).toBeInTheDocument();
        expect(screen.getByTestId("teams-table")).toBeInTheDocument();
    });


    test("renders with teams", async () => {

        const mockGetTeams = vi.spyOn(teamsRequest, "getTeams").mockResolvedValue(mockTeams);

        renderWithWrap(<TeamsPage/>)

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