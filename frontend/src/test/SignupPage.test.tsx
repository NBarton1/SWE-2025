import SignupPage from "../main/SignupPage.tsx";
import { vi } from "vitest";
import {MOCK_OK, renderWithWrap} from "../../vitest.setup.tsx";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as signupRequest from "../main/request/signup.ts";
import * as loginRequest from "../main/request/login.ts";

describe("SignupPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        renderWithWrap(<SignupPage />);
    });

    test("renders", () => {

        expect(screen.getByTestId("signup-title")).toBeInTheDocument();
        expect(screen.getByTestId("signup-name")).toBeInTheDocument();
        expect(screen.getByTestId("signup-username")).toBeInTheDocument();
        expect(screen.getByTestId("signup-password")).toBeInTheDocument();
        expect(screen.getByTestId("signup-submit")).toBeInTheDocument();
    });

    test("accepts user input", async () => {
        const user = userEvent.setup();

        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");

        expect(nameInput.value).toBe("name");
        expect(usernameInput.value).toBe("user");
        expect(passwordInput.value).toBe("password");
    });


    test("submit button clickable", async () => {
        const user = userEvent.setup();

        const submitButton = screen.getByTestId("signup-submit");

        expect(submitButton).toBeEnabled();
        await user.click(submitButton);
    });

    test("signup and login function success login", async () => {
        const user = userEvent.setup();
        const mockSignup = vi.spyOn(signupRequest, "signup").mockResolvedValue(MOCK_OK);
        const mockLogin = vi.spyOn(loginRequest, "login").mockResolvedValue(MOCK_OK);


        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;
        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");
        await user.click(signupSubmit)

        fireEvent.click(signupSubmit);

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                name: "name",
                username: "user",
                password: "password",
            });
        });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                username: "user",
                password: "password",
            });
        });

    });

});