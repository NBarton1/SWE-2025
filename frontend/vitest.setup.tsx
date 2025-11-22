import {afterEach, expect, vi} from 'vitest'
import {cleanup, render} from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import {createTheme, MantineProvider} from "@mantine/core";
import {BrowserRouter} from "react-router";
import type {Team} from "./src/main/types/team.ts";
import {Match, type MatchResponse, MatchState, MatchType} from "./src/main/types/match.ts";
import {type Account, type Coach, type Player, Role} from "./src/main/types/accountTypes.ts";
import type {Content} from "./src/main/types/content.ts";
import {InviteStatus, type TeamInvite} from "./src/main/types/invite.ts";
import type {Post} from "./src/main/types/post.ts";
import type {LikeStatus, LikeType} from "./src/main/types/like.ts";
import type {UseLikesReturn} from "./src/main/hooks/useLikes.tsx";

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

export const mockTeamDK: Team = {
    id: 1,
    name: "DK",
    win: 2,
    loss: 0,
    draw: 0,
    pointsFor: 999,
    pointsAllowed: 0,
    pct: 1
};

export const mockTeams: Team[] = [
    mockTeamDK,
    {
        id: 2,
        name: "Chickens",
        win: 0,
        loss: 2,
        draw: 0,
        pointsFor: 0,
        pointsAllowed: 1499,
        pct: 0
    },
    {
        id: 3,
        name: "Eagles",
        win: 1,
        loss: 1,
        draw: 0,
        pointsFor: 500,
        pointsAllowed: 500,
        pct: 0.5
    },
];

export const mockDate = "2026-03-14";

export const mockScheduledMatchResponse: MatchResponse = {
    id: 1,
    type: MatchType.STANDARD,
    date: `${mockDate}T03:00`,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 0,
    awayScore: 0,
    clockTimestamp: 3600,
    timeRunning: false,
    state: MatchState.SCHEDULED,
}

export const mockLiveTimeStoppedMatchResponse: MatchResponse = {
    id: 2,
    type: MatchType.STANDARD,
    date: `${mockDate}T03:00`,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 0,
    awayScore: 0,
    clockTimestamp: 3600,
    timeRunning: false,
    state: MatchState.LIVE,
}

export const mockLiveTimeRunningMatchResponse: MatchResponse = {
    id: 3,
    type: MatchType.STANDARD,
    date: `${mockDate}T03:00`,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 0,
    awayScore: 0,
    clockTimestamp: 3600,
    timeRunning: true,
    state: MatchState.LIVE,
}

export const mockFinishedMatchResponse: MatchResponse = {
    id: 4,
    type: MatchType.STANDARD,
    date: `${mockDate}T03:00`,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 0,
    awayScore: 0,
    clockTimestamp: 0,
    timeRunning: true,
    state: MatchState.FINISHED,
}

export const mockScheduledMatch = new Match(mockScheduledMatchResponse);
export const mockLiveTimeRunningMatch = new Match(mockLiveTimeRunningMatchResponse);
export const mockLiveTimeStoppedMatch = new Match(mockLiveTimeStoppedMatchResponse);
export const mockFinishedMatch = new Match(mockFinishedMatchResponse);


export const mockMatches: Match[] = [
    mockScheduledMatch,
    mockLiveTimeRunningMatch,
    mockLiveTimeStoppedMatch,
    mockFinishedMatch
];

export const mockContent: Content = {
    id: 1,
    filename: "",
    fileSize: 0,
    contentType: "",
    downloadUrl: "",
}

export const mockUnapprovedContent: Content[] = [mockContent];

export const mockPlayerAccount: Account = {
    id: 2,
    name: "Diddy Kong",
    username: "diddyk",
    // @ts-ignore
    picture: mockContent,
    email: null,
    role: Role.PLAYER
}

export const mockAdminAccount: Account = {
    id: 1,
    name: "Donkey Kong",
    username: "dk",
    // @ts-ignore
    picture: mockContent,
    email: "dkwon@dk.com",
    role: Role.ADMIN
}

export const mockPlayer: Player = {
    account: mockPlayerAccount,
    guardian: mockAdminAccount,
    team: mockTeamDK,
    hasPermission: true,
    position: "QB",
}

export const coachDK: Coach = {
    account: mockAdminAccount,
    team: mockTeamDK,
    likes: Infinity,
    dislikes: -Infinity,
}

export const mockTeamInvite: TeamInvite = {
    team: mockTeamDK,
    player: mockPlayer,
    status: InviteStatus.PENDING,
}

export const mockDependents: Player[] = [
    {
        account: {
            id: 2,
            name: "Diddy Kong",
            username: "diddyk",
            email: null,
            picture: null,
            role: Role.PLAYER,
        },
        hasPermission: true,
    },
    {
        account: {
            id: 3,
            name: "Dixie Kong",
            username: "dixiek",
            email: null,
            picture: null,
            role: Role.PLAYER
        },
        hasPermission: false,
    },
    {
        account: {
            id: 4,
            name: "Chunky Kong",
            username: "chunkyk",
            email: null,
            picture: null,
            role: Role.PLAYER
        },
        hasPermission: false,
    },
];

export const mockContentImage: Content = {
    id: 1,
    filename: "dk.png",
    fileSize: -Infinity,
    contentType: "image/png",
    downloadUrl: "http://localhost:8080/api/content/1",
}

// @ts-ignore
export const mockPost: Post = {
    id: 1,
    account: mockAdminAccount,
    textContent: "DK won",
}

// @ts-ignore
export const mockFlaggedPost: Post = {
    id: 2,
    account: mockPlayerAccount,
    textContent: "DK lost",
    flagCount: 1000,
}

export const mockFlaggedPosts = [mockFlaggedPost]

// export const mockLikeStatus: LikeStatus = {
//     id: 1,
//     account: mockAdminAccount,
//     likeType: "POST",
//     entityId: 1,
//     liked: true
// }

export const mockUseLikesReturn: UseLikesReturn = {
    numLikes: 1,
    numDislikes: 1,
    percentLikes: 50,
    percentDislikes: 50,
    reaction: null,
    handleReact: vi.fn()
}

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


