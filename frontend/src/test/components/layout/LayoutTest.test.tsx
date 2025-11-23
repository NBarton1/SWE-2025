import {describe, expect, vi} from "vitest";
import {mockPlayerAccount, renderWithWrap} from "../../../../vitest.setup.tsx";
import Layout from "../../../main/components/layout/Layout.tsx";
import {screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";


vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockPlayerAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("Layout", () => {

    test("renders", () => {
        renderWithWrap(
            <Layout/>
        )
        expect(screen.getByTestId("layout-appshell")).toBeInTheDocument();
        expect(screen.getByTestId("theme-button")).toBeInTheDocument();
        // Content to be surrounded by the shell should be in the document
        expect(screen.getByTestId("outlet")).toBeInTheDocument();
    })


    test("dark-mode-change", async () => {
        renderWithWrap(
            <Layout/>
        )

        const user = userEvent.setup();
        const themeButton = screen.getByTestId("theme-button")

        await user.click(themeButton)

        const initialIcon = themeButton.querySelector('svg');
        if (!initialIcon)  assert.fail()

        const isLight = initialIcon.classList.contains('lucide-sun') ||
            themeButton.textContent.includes('Sun');

        await user.click(themeButton)

        const newIcon = themeButton.querySelector('svg');
        if (!newIcon)  assert.fail()
        const isNowLight = newIcon.classList.contains('lucide-sun') ||
            themeButton.textContent.includes('Sun');

        expect(isNowLight).not.toBe(isLight)
    })
})

