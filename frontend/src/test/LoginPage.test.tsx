import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router";
import LoginPage from "../main/LoginPage";
import * as loginRequest from "../main/request/login";
import {MantineProvider} from "@mantine/core";

vi.mock("../main/request/login");

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
    Routes: ({ children }: { children: React.ReactNode }) => children,
    Route: ({ children }: { children: React.ReactNode }) => children,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
        <a href={to}>{children}</a>
    ),
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
}));

const renderWithExtra = (component: React.ReactElement) => {
    return render(
        <MantineProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </MantineProvider>
    );
};


const OK = new Response('OK', { status: 200 });
const UNAUTHORIZED = new Response('Unauthorized', { status: 401 });

describe("LoginPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        renderWithExtra(<LoginPage />);
    });

    it("renders login form with all fields", () => {

        expect(screen.getByTestId("login-username")).toBeInTheDocument();
        expect(screen.getByTestId("login-password")).toBeInTheDocument();
        expect(screen.getByTestId("login-submit")).toBeInTheDocument();
    });

    it("allows user to type in username and password fields", () => {

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");

        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(passwordInput, { target: { value: "pass" } });

        expect(usernameInput).toHaveValue("test");
        expect(passwordInput).toHaveValue("pass");
    });

    it("calls login function with correct credentials", async () => {
        const mockLogin = vi.spyOn(loginRequest, "login").mockResolvedValue(OK);

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");
        const submitButton = screen.getByTestId("login-submit");

        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(passwordInput, { target: { value: "pass" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                username: "test",
                password: "pass",
            });
        });
    });

    it("navigates to /teams on successful login", async () => {
        vi.spyOn(loginRequest, "login").mockResolvedValue(OK);

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");
        const submitButton = screen.getByTestId("login-submit");

        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(passwordInput, { target: { value: "pass" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/teams");
        });
    });

    it("does not navigate on failed login", async () => {
        vi.spyOn(loginRequest, "login").mockResolvedValue(UNAUTHORIZED);

        const usernameInput = screen.getByTestId("login-username");
        const passwordInput = screen.getByTestId("login-password");
        const submitButton = screen.getByTestId("login-submit");

        fireEvent.change(usernameInput, { target: { value: "test" } });
        fireEvent.change(passwordInput, { target: { value: "incorrect" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(loginRequest.login).toHaveBeenCalled();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});