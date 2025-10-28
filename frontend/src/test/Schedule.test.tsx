import { vi } from "vitest";
import {mockDate, mockMatches, renderWithWrap} from "../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import Schedule from "../main/components/schedule/Schedule.tsx";
import * as matchRequest from "../main/request/matches.ts";
import * as teamRequest from "../main/request/teams.ts";
import type {DateClickArg} from "@fullcalendar/interaction";

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

        vi.spyOn(matchRequest, "getMatches").mockResolvedValue([]);
        vi.spyOn(teamRequest, "getTeams").mockResolvedValue([]);
    });

    test("renders components", async () => {
        renderWithWrap(<Schedule />);

        await waitFor(() => {
            expect(screen.getByTestId("calendar")).toBeInTheDocument();
            expect(screen.getByTestId("schedule-title")).toBeInTheDocument();
            expect(screen.getByTestId("schedule-paper")).toBeInTheDocument();
        });
    });

    test("fetches matches and teams", async () => {


        renderWithWrap(<Schedule />);

        await waitFor(() => {
            expect(matchRequest.getMatches).toHaveBeenCalled();
            expect(teamRequest.getTeams).toHaveBeenCalled();
        });
    });

    test("popup opened when date clicked", async () => {
        renderWithWrap(<Schedule />);

        mockDateClick?.({ dateStr: mockDate } as DateClickArg);

        await waitFor(() => {
            expect(screen.getByTestId("date-popup")).toBeInTheDocument();
        });
    })

    test("matches populate on calendar", async () => {

        vi.spyOn(matchRequest, "getMatches").mockResolvedValue(mockMatches);

        renderWithWrap(<Schedule />);

        await waitFor(() => {
            expect(mockEvents.length).toBe(1);
        });
    });
});
