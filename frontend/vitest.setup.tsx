import {expect, afterEach, vi} from 'vitest'
import {cleanup, render} from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import {createTheme, MantineProvider} from "@mantine/core";
import {BrowserRouter} from "react-router";

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

vi.mock("../main/request/login");
vi.mock("../main/request/signup");

export const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
    Routes: ({ children }: { children: React.ReactNode }) => children,
    Route: ({ children }: { children: React.ReactNode }) => children,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to}>{children}</a>
    ),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
}));

export const MOCK_OK = new Response('OK', { status: 200 });
export const MOCK_UNAUTHORIZED = new Response('Unauthorized', { status: 401 });

export const renderWithWrap = (component: React.ReactElement) => {
    return render(
        <MantineProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </MantineProvider>
    );
};


