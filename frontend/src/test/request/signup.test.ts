import {signup, type SignupRequest} from "../../main/request/signup.ts";
import {beforeEach, expect, vi} from "vitest";
import {waitFor} from "@testing-library/react";


describe("players", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => null,
        } as Response);
    });

    test("signup", async () => {

        const signupRequest: SignupRequest = {
            name: "a",
            username: "a",
            email: "a",
            password: "a",
            role: "ADMIN"
        }

        await signup(signupRequest);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/accounts", expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(signupRequest),
                })
            )
        });
    })
})
