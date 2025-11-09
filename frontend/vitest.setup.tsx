import {expect, afterEach, vi} from 'vitest'
import {cleanup, render} from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import {createTheme, MantineProvider} from "@mantine/core";
import {BrowserRouter} from "react-router";
import type {Team} from "./src/main/types/team.ts";
import {type Match, MatchType} from "./src/main/types/match.ts";

expect.extend(matchers)

export const testTheme = createTheme({
    colors: {
        violet: [
            '#f3e5ff', '#e1bfff', '#c58cff', '#a75aff', '#8a26ff',
            '#6a0dad', '#5800a1', '#440084', '#310066', '#1d003f',
        ],
    },
    primaryColor: 'violet',
    primaryShade: 6,
});

export const mockTeams: Team[] = [
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

export const mockDate = "2026-03-14";

export const mockMatches: Match[] = [
    {
        id: 1,
        type: MatchType.STANDARD,
        date: `${mockDate}T03:00`,
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1],
        homeScore: 0,
        awayScore: 7,
        clockTimestamp: 60,
        timeRunning: false,
        state: "SCHEDULED",
    }
];


afterEach(() => {
    cleanup()
})

// Workaround for https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

global.ResizeObserver = vi.fn().mockImplementation(function(this: any) {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
});

vi.mock("../main/request/login");
vi.mock("../main/request/signup");
vi.mock("../main/request/teams.ts", () => ({
    getTeams: vi.fn(),
}));

export const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
    Routes: ({ children }: { children: React.ReactNode }) => children,
    Route: ({ children }: { children: React.ReactNode }) => children,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to}>{children}</a>
    ),
    Outlet: () => <div data-testid="outlet">Outlet</div>, // Add this
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
}));

export const MOCK_OK = new Response('OK', { status: 200 });
export const MOCK_UNAUTHORIZED = new Response('Unauthorized', { status: 401 });

export const renderWithWrap = (component: React.ReactElement) => {
    return render(
        <MantineProvider theme={testTheme}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </MantineProvider>
    );
};


