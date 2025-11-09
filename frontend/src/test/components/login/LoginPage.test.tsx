import { screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import LoginPage from "../../../main/components/login/LoginPage.tsx";
import * as authRequest from "../../../main/request/auth";
import {MOCK_OK, MOCK_UNAUTHORIZED, mockNavigate, renderWithWrap} from "../../../../vitest.setup.tsx";


describe("LoginPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        renderWithWrap(<LoginPage />);
    });

    test("renders login form with all fields", () => {
        expect(screen.getByTestId("login-title")).toBeInTheDocument();
        expect(screen.getByTestId("login-username")).toBeInTheDocument();
        expect(screen.getByTestId("login-password")).toBeInTheDocument();
        expect(screen.getByTestId("login-submit")).toBeInTheDocument();
    });

    test("user types username and password", async () => {
        const user = userEvent.setup();

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");

        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");

        expect(usernameInput).toHaveValue("user");
        expect(passwordInput).toHaveValue("password");
    });
    //
    test("calls login function with correct credentials", async () => {
        const user = userEvent.setup();
        const mockLogin = vi.spyOn(authRequest, "login").mockResolvedValue(MOCK_OK);

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");
        const submitButton = screen.getByTestId("login-submit");

        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                username: "user",
                password: "password",
            });
        });
    });
    //
    test("navigate on success", async () => {
        const user = userEvent.setup();
        vi.spyOn(authRequest, "login").mockResolvedValue(MOCK_OK);

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");
        const submitButton = screen.getByTestId("login-submit");

        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");
        await user.click(submitButton);

        await waitFor(() => {
            expect(authRequest.login).toHaveBeenCalledWith({
                username: "user",
                password: "password"
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });

    });

    test("no navigate on fail", async () => {
        const user = userEvent.setup();
        vi.spyOn(authRequest, "login").mockResolvedValue(MOCK_UNAUTHORIZED);

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");
        const submitButton = screen.getByTestId("login-submit");

        await user.type(usernameInput, "user");
        await user.type(passwordInput, "incorrect");
        await user.click(submitButton);

        await waitFor(() => {
            expect(authRequest.login).toHaveBeenCalledWith({
                username: "user",
                password: "incorrect"
            });
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});