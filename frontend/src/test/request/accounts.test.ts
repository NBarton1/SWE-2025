import { vi, beforeEach } from 'vitest';
import {waitFor} from "@testing-library/react";
import {
    deleteAccount,
    getAccount,
    getAccounts,
    getDependents,
    updateAccount, updateAccountPicture,
    type UpdateAccountRequest
} from "../../main/request/accounts.ts";


const success = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => null,
} as Response);

const fail = vi.fn().mockRejectedValue(new Error("fail"));

describe("accounts", () => {
    beforeEach(() => {
        global.fetch = success;
    });

    test("getAccounts success", async () => {

        await getAccounts();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/accounts",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );
        });
    })

    test("getAccounts fail", async () => {

        global.fetch = fail;

        const res = await getAccounts();

        expect(res).toStrictEqual([]);
    })

    test("getAccount", async () => {
        await getAccount(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/accounts/1",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );
        });
    })

    test("getAccount fail", async () => {
        global.fetch = fail;

        const res = await getAccount(1);

        expect(res).toBeNull();
    })

    test("updateAccount", async () => {
        let req: UpdateAccountRequest = {
            name: "dk",
        }

        await updateAccount(1, req);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/api/accounts/${1}`, expect.objectContaining({
                    method: "PUT",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(req)
                })
            );
        });
    })

    test("updateAccount fail", async () => {

        global.fetch = fail;

        let req: UpdateAccountRequest = {
            name: "dk",
        }

        const res = await updateAccount(1, req);

        expect(res).toBeNull();
    })

    test("getDependents", async () => {

        await getDependents();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/accounts/dependents", expect.objectContaining({
                    method: "GET",
                    credentials: "include"
                })
            );
        });
    })

    test("getDependents fail", async () => {

        global.fetch = fail;

        const res = await getDependents();

        expect(res).toStrictEqual([]);
    })

    test("updateAccountPicture", async () => {

        await updateAccountPicture(1, null as unknown as File);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/api/accounts/${1}/picture`, expect.objectContaining({
                    method: "PATCH",
                    credentials: "include",
                })
            );
        });
    })

    test("updateAccountPicture fail", async () => {

        global.fetch = fail;

        const res = await updateAccountPicture(1, null as unknown as File);

        expect(res).toBeNull();
    })

    test("deleteAccount", async () => {

        await deleteAccount(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/api/accounts/${1}`, expect.objectContaining({
                    method: "DELETE",
                    credentials: 'include',
                })
            );
        });
    })

    test("deleteAccount fail", async () => {

        global.fetch = fail;

        const res = await deleteAccount(1);

        expect(res).toBeNull();
    })
});
