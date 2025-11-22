import { vi, describe, test, beforeEach, expect } from "vitest";
import {mockDate, mockMatches, mockPlayerAccount, mockTeams, renderWithWrap} from "../../../../vitest.setup.tsx";
import { screen, waitFor } from "@testing-library/react";
import type { DateClickArg } from "@fullcalendar/interaction";
import Calendar from "../../../main/components/schedule/Calendar.tsx";

let mockDateClick: ((arg: DateClickArg) => void) | undefined;
let mockEventClick: ((arg: any) => void) | undefined;
let mockEvents: any[];

vi.mock("@fullcalendar/react", () => ({
    default: (props: any) => {
        mockDateClick = props.dateClick;
        mockEventClick = props.eventClick;
        mockEvents = props.events || [];
        return (<div data-testid="calendar">Mocked Calendar</div>);
    },
}));

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockPlayerAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("Calendar", () => {
    const mockSetMatches = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders", () => {
        renderWithWrap(
            <Calendar
                teams={mockTeams}
                matches={[]}
                setMatches={mockSetMatches}
            />
        );

        expect(screen.getByTestId("calendar")).toBeInTheDocument();
        expect(screen.getByTestId("schedule-title")).toBeInTheDocument();
    });

    test("popup opened when date clicked", async () => {
        renderWithWrap(
            <Calendar
                teams={mockTeams}
                matches={[]}
                setMatches={mockSetMatches}
            />
        );

        mockDateClick?.({ dateStr: mockDate } as DateClickArg);

        await waitFor(() => {
            expect(screen.getByTestId("date-popup")).toBeInTheDocument();
        });
    });

    test("opens event popup when event is clicked", async () => {
        renderWithWrap(
            <Calendar
                teams={mockTeams}
                matches={mockMatches}
                setMatches={mockSetMatches}
            />
        );

        const mockEventInfo = {
            event: {
                extendedProps: {
                    match: mockMatches[0]
                }
            }
        };

        mockEventClick?.(mockEventInfo);

        await waitFor(() => {
            expect(screen.getByTestId("event-popup")).toBeInTheDocument();
        });
    });

    test("displays matches as events on calendar", () => {
        renderWithWrap(
            <Calendar
                teams={mockTeams}
                matches={mockMatches}
                setMatches={mockSetMatches}
            />
        );

        expect(mockEvents.length).toBe(mockMatches.length);
    });
});