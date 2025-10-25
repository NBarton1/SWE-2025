import {expect, afterEach, vi} from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import {createTheme} from "@mantine/core";

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

