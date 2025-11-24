import {vi, expect} from 'vitest';
import {waitFor} from "@testing-library/react";
import {deleteFlag, flagPost, getFlag, getFlagCountForPost} from "../../main/request/flags.ts";
import {mockFlag} from "../../../vitest.setup.tsx";


const fail = vi.fn().mockRejectedValue(new Error("fail"));

describe("flags", () => {

    test("getFlagCountForPost success", async () => {

        const flagCount = 3;

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => flagCount.toString(),
        } as Response);

        const res = await getFlagCountForPost(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/flags",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(flagCount);
        });
    })

    test("getFlagCountForPost fail", async () => {

        global.fetch = fail;

        const res = await getFlagCountForPost(1);

        expect(res).toStrictEqual(0);
    })

    test("flagPost success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockFlag,
        } as Response);

        const res = await flagPost(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/flags",
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(mockFlag);
        });
    })

    test("flagPost fail", async () => {

        global.fetch = fail;

        const res = await flagPost(1);

        expect(res).toStrictEqual(null);
    })

    test("getFlag success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockFlag,
        } as Response);

        const res = await getFlag(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/posts/1/flag",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(mockFlag);
        });
    })

    test("getFlag fail", async () => {

        global.fetch = fail;

        const res = await getFlag(1);

        expect(res).toStrictEqual(null);
    })

    test("deleteFlag success", async () => {

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => true,
        } as Response);

        const res = await deleteFlag(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/flags/1",
                expect.objectContaining({
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(true);
        });
    })

    test("deleteFlag fail", async () => {

        global.fetch = fail;

        const res = await deleteFlag(1);

        expect(res).toStrictEqual(false);
    })
});
