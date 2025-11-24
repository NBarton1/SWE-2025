import { screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import userEvent from '@testing-library/user-event';
import LoginPage from "../../../main/components/login/LoginPage.tsx";
import { mockNavigate, renderWithWrap } from "../../../../vitest.setup.tsx";

const mockTryLogin = vi.fn();

vi.mock("../../../main/hooks/useLogin.tsx", () => ({
    useLogin: () => ({
        tryLogin: mockTryLogin
    })
}));

describe("LoginPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders login form with all fields", () => {
        renderWithWrap(<LoginPage />);

        expect(screen.getByTestId("login-title")).toBeInTheDocument();
        expect(screen.getByTestId("login-username")).toBeInTheDocument();
        expect(screen.getByTestId("login-password")).toBeInTheDocument();
        expect(screen.getByTestId("login-submit")).toBeInTheDocument();
    });

    test("user types username and password", async () => {
        renderWithWrap(<LoginPage />);

        const user = userEvent.setup();

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");

        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");

        expect(usernameInput).toHaveValue("user");
        expect(passwordInput).toHaveValue("password");
    });

    test("tryLogin called", async () => {
        renderWithWrap(<LoginPage />);

        const user = userEvent.setup();

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");
        const submitButton = screen.getByTestId("login-submit");

        await user.type(usernameInput, "username");
        await user.type(passwordInput, "password");
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockTryLogin).toHaveBeenCalledTimes(1);
            expect(mockTryLogin).toHaveBeenCalledWith("username", "password");
        });
    });

    test("navigate to signup page", async () => {
        renderWithWrap(<LoginPage />);

        const user = userEvent.setup();
        const signupButton = screen.getByTestId("login-signup");

        await user.click(signupButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/signup");
        });
    });
});