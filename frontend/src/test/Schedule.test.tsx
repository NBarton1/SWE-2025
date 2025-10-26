import { vi } from "vitest";
import {renderWithWrap} from "../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import Schedule from "../main/schedule/Schedule.tsx";
import * as matchRequest from "../main/request/matches.ts";
import * as teamRequest from "../main/request/teams.ts";
import type {DateClickArg} from "@fullcalendar/interaction";
import type {Team} from "../main/schedule/team.ts";
import {MatchType, type Match} from "../main/schedule/match.ts";

let mockDateClick: ((arg: DateClickArg) => void) | undefined;
let mockEvents: any[];

vi.mock("@fullcalendar/react", () => ({
    default: (props: any) => {
        mockDateClick = props.dateClick;
        mockEvents = props.events || [];
        return (<div data-testid="calendar">Mocked Calendar</div>);
    },
}));

describe("Schedule", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders components", () => {
        renderWithWrap(<Schedule />);
        expect(screen.getByTestId("calendar")).toBeInTheDocument();
        expect(screen.getByTestId("schedule-title")).toBeInTheDocument();
        expect(screen.getByTestId("schedule-paper")).toBeInTheDocument();
    });

    test("fetches matches and teams", async () => {
        vi.spyOn(matchRequest, "getMatches").mockResolvedValue([]);
        vi.spyOn(teamRequest, "getTeams").mockResolvedValue([]);

        renderWithWrap(<Schedule />);

        await waitFor(() => {
            expect(matchRequest.getMatches).toHaveBeenCalled();
            expect(teamRequest.getTeams).toHaveBeenCalled();
        });
    });

    test("popup opened when date clicked", async () => {
        renderWithWrap(<Schedule />);

        mockDateClick?.({ dateStr: "2024-03-15" });

        await waitFor(() => {
            expect(screen.getByTestId("date-popup")).toBeInTheDocument();
        });
    })

    test("fetches matches and teams1", async () => {

        const match: Match = {
            id: 1,
            type: MatchType.STANDARD,
            date: "2024-03-15",
            homeTeam: { name: "home" } as Team,
            awayTeam: { name: "away" } as Team
        };

        vi.spyOn(matchRequest, "getMatches").mockResolvedValue([match]);

        renderWithWrap(<Schedule />);

        await waitFor(() => {
            expect(mockEvents.length).toBe(1);
        });
    });
});
