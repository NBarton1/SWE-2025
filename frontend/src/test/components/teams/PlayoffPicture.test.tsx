import {screen, waitFor} from "@testing-library/react";
import {beforeEach, expect, vi} from "vitest";
import {
    mockTeams,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import PlayoffPicture from "../../../main/components/teams/PlayoffPicture.tsx";
import * as teamsRequest from "../../../main/request/teams.ts";


vi.mock("../../../main/request/teams.ts", () => ({
    getPlayoffTeams: vi.fn(),
}));

describe("PlayoffPicture", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders", async () => {

        vi.spyOn(teamsRequest, "getPlayoffTeams").mockResolvedValue(mockTeams);

        renderWithWrap(<PlayoffPicture />);

        await waitFor(() => {
            expect(screen.queryByTestId("playoff-picture")).toBeInTheDocument();
            expect(screen.queryByTestId("not-enough-matches-played-indicator")).not.toBeInTheDocument();
        })
    });

    test("displays playoff teams when enough matches played", async () => {

        vi.spyOn(teamsRequest, "getPlayoffTeams").mockResolvedValue(mockTeams);

        renderWithWrap(<PlayoffPicture />);

        await waitFor(() => {
            expect(screen.queryByTestId("not-enough-matches-played-indicator")).not.toBeInTheDocument();
        })
    });

    test("does not display teams when not enough matches played", async () => {

        vi.spyOn(teamsRequest, "getPlayoffTeams").mockResolvedValue([]);

        renderWithWrap(<PlayoffPicture />);

        await waitFor(() => {
            expect(screen.queryByTestId("not-enough-matches-played-indicator")).toBeInTheDocument();
        })
    });
});
