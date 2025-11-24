import { vi, describe, test, beforeEach, expect } from "vitest";
import {mockPlayerAccount, renderWithWrap} from "../../../../vitest.setup.tsx";
import { screen, waitFor } from "@testing-library/react";
import * as matchRequest from "../../../main/request/matches.ts";
import * as teamRequest from "../../../main/request/teams.ts";
import Schedule from "../../../main/components/schedule/Schedule.tsx";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("../../../main/components/schedule/Calendar.tsx", () => ({
    default: () => <div data-testid="calendar"/>
}));

vi.mock("../../../main/components/schedule/ScheduleList.tsx", () => ({
    default: () => <div data-testid="schedule-list"/>
}));


vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockPlayerAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("Schedule", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(matchRequest, "getMatches").mockResolvedValue([]);
        vi.spyOn(teamRequest, "getTeams").mockResolvedValue([]);
    });

    test("renders schedule paper", async () => {
        renderWithWrap(
            <MemoryRouter>
                <Schedule />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("schedule-paper")).toBeInTheDocument();
        });
    });

    test("fetches matches and teams on mount", async () => {
        renderWithWrap(
            <MemoryRouter>
                <Schedule />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(matchRequest.getMatches).toHaveBeenCalledTimes(1);
            expect(teamRequest.getTeams).toHaveBeenCalledTimes(1);
        });
    });

    test("renders new match button", async () => {
        renderWithWrap(
            <MemoryRouter>
                <Schedule />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("new-match-button")).toBeInTheDocument();
        });
    });

    test("opens new match modal when button clicked", async () => {
        const user = userEvent.setup();

        renderWithWrap(
            <MemoryRouter>
                <Schedule />
            </MemoryRouter>
        );

        const newMatchButton = screen.getByTestId("new-match-button");
        await user.click(newMatchButton);

        await waitFor(() => {
            expect(screen.getByTestId("event-popup")).toBeInTheDocument();
        });
    });

    test("defaults to calendar view", async () => {
        renderWithWrap(
            <MemoryRouter>
                <Schedule />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("calendar")).toBeInTheDocument();
            expect(screen.queryByTestId("schedule-list")).not.toBeInTheDocument();
        });
    });

    test("renders list view when view=list in search params", async () => {
        renderWithWrap(
            <MemoryRouter initialEntries={["/?view=list"]}>
                <Schedule />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("schedule-list")).toBeInTheDocument();
            expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
        });
    });

    test("renders calendar view when view=calendar in search params", async () => {
        renderWithWrap(
            <MemoryRouter initialEntries={["/?view=calendar"]}>
                <Schedule />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("calendar")).toBeInTheDocument();
            expect(screen.queryByTestId("schedule-list")).not.toBeInTheDocument();
        });
    });

    test("toggles from calendar to list view", async () => {
        const user = userEvent.setup();

        renderWithWrap(
            <MemoryRouter>
                <Schedule />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("calendar")).toBeInTheDocument();
        });

        const toggleButton = screen.getByTestId("view-toggle-button");
        await user.click(toggleButton);

        await waitFor(() => {
            expect(screen.queryByTestId("calendar")).not.toBeInTheDocument();
            expect(screen.getByTestId("schedule-list")).toBeInTheDocument();
        });
    });

    test("toggles from list to calendar view", async () => {
        const user = userEvent.setup();

        renderWithWrap(
            <MemoryRouter initialEntries={["/?view=list"]}>
                <Schedule />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("schedule-list")).toBeInTheDocument();
        });

        const toggleButton = screen.getByTestId("view-toggle-button");
        await user.click(toggleButton);

        await waitFor(() => {
            expect(screen.getByTestId("calendar")).toBeInTheDocument();
            expect(screen.queryByTestId("schedule-list")).not.toBeInTheDocument();
        });
    });
});
