import {screen, waitFor} from "@testing-library/react";
import {beforeEach, vi} from "vitest";
import {renderWithWrap} from "../../vitest.setup.tsx";
import TeamsPage from "../main/TeamsPage.tsx";
import type {Team} from "../main/schedule/team.ts";
import * as teamsRequest from "../main/request/teams.ts";


const mockTeams: Team[] = [
    {
        id: 1,
        name: "DK",
        win: 2,
        loss: 0,
        draw: 0,
        pointsFor: 999,
        pointsAllowed: 0,
    },
    {
        id: 2,
        name: "Chickens",
        win: 0,
        loss: 2,
        draw: 0,
        pointsFor: 0,
        pointsAllowed: 1499,
    },
    {
        id: 3,
        name: "Eagles",
        win: 1,
        loss: 1,
        draw: 0,
        pointsFor: 500,
        pointsAllowed: 500,
    },
];

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

        expect(screen.getByTestId("teams-title")).toBeInTheDocument();
        expect(screen.getByTestId("teams-table")).toBeInTheDocument();

        expect(screen.getByText("DK")).toBeInTheDocument();
        expect(screen.getByText("Chickens")).toBeInTheDocument();
        expect(screen.getByText("Eagles")).toBeInTheDocument();
    });
});