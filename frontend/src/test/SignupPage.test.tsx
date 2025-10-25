import {render} from '@testing-library/react'
import {MemoryRouter} from "react-router";
import {MantineProvider} from "@mantine/core";
import {testTheme} from "../../vitest.setup.ts";
import SignupPage from "../main/SignupPage.tsx";

describe('SignupPage', () => {

    it('renders the signup form', () => {

        const { container } = render(
            <MantineProvider theme={testTheme}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </MantineProvider>
        )
        expect(container).toBeInTheDocument()
    })
})