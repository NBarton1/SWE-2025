import SignupPage from "../../../main/components/signup/SignupPage.tsx";
import {expect, vi} from "vitest";
import {MOCK_OK, MOCK_UNAUTHORIZED, mockNavigate, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as signupRequest from "../../../main/request/signup.ts";
import * as authRequest from "../../../main/request/auth.ts";
import {Role} from "../../../main/types/accountTypes.ts";

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
        const mockLogin = vi.spyOn(authRequest, "login").mockResolvedValue(MOCK_OK);

        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;
        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");
        await user.click(signupSubmit);

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                email: "",
                name: "name",
                password: "password",
                role: Role.PLAYER,
                username: "user",
            });
        });

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                username: "user",
                password: "password",
            });
        });

    });


    test("signup and login function fail login", async () => {
        const user = userEvent.setup();
        const mockSignup = vi.spyOn(signupRequest, "signup").mockResolvedValue(MOCK_UNAUTHORIZED);
        const mockLogin = vi.spyOn(authRequest, "login").mockResolvedValue(MOCK_OK);

        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;
        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "user");
        await user.type(passwordInput, "incorrect");
        await user.click(signupSubmit);

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                email: "",
                name: "name",
                password: "incorrect",
                role: Role.PLAYER,
                username: "user",
            });
        });

        await waitFor(() => {
            expect(mockLogin).not.toHaveBeenCalled();
        });
    });

    test("signup as guardian", async () => {
        const user = userEvent.setup();
        const mockSignup = vi.spyOn(signupRequest, "signup").mockResolvedValue(MOCK_OK);
        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;
        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;
        const signupRadio = screen.getByTestId("signup-radio-guardian") as HTMLButtonElement;

        signupRadio.click()
        const emailInput = screen.getByTestId("signup-email") as HTMLInputElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "user");
        await user.type(emailInput, "example@test.com");
        await user.type(passwordInput, "password");

        await user.click(signupSubmit);

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                email: "example@test.com",
                name: "name",
                password: "password",
                role: Role.GUARDIAN,
                username: "user",
            });
        });
    })


    test("press login to navigate to login page", async () => {
        const user = userEvent.setup();
        const signupLoginButton = screen.getByTestId("signup-login") as HTMLButtonElement;

        await user.click(signupLoginButton)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login")
        })
    })

    test("fail form validation name too short", async () => {
        const mockSignup = vi.spyOn(signupRequest, "signup").mockResolvedValue(MOCK_OK);

        const user = userEvent.setup();

        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;
        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;

        await user.type(nameInput, "n");
        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");

        await user.click(signupSubmit)
        await waitFor(() => {
            expect(mockSignup).not.toHaveBeenCalled()
        })
    })


    test("fail form validation user too short", async () => {
        const mockSignup = vi.spyOn(signupRequest, "signup").mockResolvedValue(MOCK_OK);

        const user = userEvent.setup();

        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;
        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "u");
        await user.type(passwordInput, "password");

        await user.click(signupSubmit)
        await waitFor(() => {
            expect(mockSignup).not.toHaveBeenCalled()
        })
    })

    test("fail form validation password too short", async () => {
        const mockSignup = vi.spyOn(signupRequest, "signup").mockResolvedValue(MOCK_OK);

        const user = userEvent.setup();

        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;
        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "user");
        await user.type(passwordInput, "g");

        await user.click(signupSubmit)
        await waitFor(() => {
            expect(mockSignup).not.toHaveBeenCalled()
        })
    })

    test("fail form validation email invalid", async () => {
        const mockSignup = vi.spyOn(signupRequest, "signup").mockResolvedValue(MOCK_OK);

        const user = userEvent.setup();

        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;
        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;
        const signupRadio = screen.getByTestId("signup-radio-guardian") as HTMLButtonElement;

        signupRadio.click()
        const emailInput = screen.getByTestId("signup-email") as HTMLInputElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");
        await user.type(emailInput, "e");

        await user.click(signupSubmit)
        await waitFor(() => {
            expect(mockSignup).not.toHaveBeenCalled()
        })
    })

    test("click guardian button and player button", async () => {
        const mockSignup = vi.spyOn(signupRequest, "signup").mockResolvedValue(MOCK_OK);
        const user = userEvent.setup();

        const nameInput = screen.getByTestId("signup-name") as HTMLInputElement;
        const usernameInput = screen.getByTestId("signup-username") as HTMLInputElement;
        const passwordInput = screen.getByTestId("signup-password") as HTMLInputElement;

        const signupRadioGuardian = screen.getByTestId("signup-radio-guardian") as HTMLButtonElement;
        const signupRadioPlayer = screen.getByTestId("signup-radio-player") as HTMLButtonElement;

        const signupSubmit = screen.getByTestId("signup-submit") as HTMLButtonElement;

        await user.click(signupRadioGuardian)
        const emailInput = screen.getByTestId("signup-email") as HTMLInputElement;

        await user.type(nameInput, "name");
        await user.type(usernameInput, "user");
        await user.type(passwordInput, "password");
        await user.type(emailInput, "example@test.com");
        await user.click(signupSubmit)

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                email: "example@test.com",
                name: "name",
                password: "password",
                role: Role.GUARDIAN,
                username: "user",
            })
        })

        await user.click(signupRadioPlayer)

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalled()
        })

        await user.click(signupSubmit)

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith({
                email: "",
                name: "name",
                password: "password",
                role: Role.PLAYER,
                username: "user",
            })
        })
    })
});