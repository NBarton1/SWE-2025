import {login, type LoginRequest, logout} from "../../main/request/auth.ts";
import {beforeEach, expect, vi} from "vitest";
import {waitFor} from "@testing-library/react";


describe("auth", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => null,
        } as Response);;
    });

    test("login", async () => {
        let req: LoginRequest = {
            username: "a",
            password: "a",
        }

        await login(req);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/accounts/login",
                expect.objectContaining({
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(req),
                })
            )
        });
    })

    test("logout", async () => {

        await logout();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/accounts/logout",
                expect.objectContaining({
                    method: "POST",
                    credentials: "include",
                })
            )
        });
    })

})
