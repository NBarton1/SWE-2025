import {expect, vi} from "vitest";
import {renderWithWrap, mockMatches, mockPlayerAccount, mockTeams} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom';
import * as matchRequest from "../../../main/request/matches.ts";
import ScheduleList from "../../../main/components/schedule/ScheduleList.tsx";
import type {Match} from "../../../main/types/match.ts";
import type {Team} from "../../../main/types/team.ts";
import React, {type Dispatch} from "react";

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockPlayerAccount,
        setCurrentAccount: vi.fn()
    })
}));

let mockProps: {
    matches: Match[]
    teams: Team[]
    setMatches: Dispatch<React.SetStateAction<Match[]>>
}

describe("ScheduleList", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            matches: mockMatches,
            teams: mockTeams,
            setMatches: vi.fn(),
        }
    });

    test("renders ScheduleList component", async () => {
        vi.spyOn(matchRequest, "getMatches").mockResolvedValue(mockMatches);

        renderWithWrap(<ScheduleList {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("schedule-list-title")).toBeInTheDocument();
        });
    });

    test("renders list of matches", async () => {
        vi.spyOn(matchRequest, "getMatches").mockResolvedValue(mockMatches);
        renderWithWrap(<ScheduleList {...mockProps} />);

        for (const match of mockMatches) {

            await waitFor(() => {
                expect(screen.getByTestId(`live-match-view-${match.getId()}`)).toBeInTheDocument();
            })
        }
    });
});
