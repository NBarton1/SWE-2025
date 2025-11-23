import {vi, beforeEach, expect} from 'vitest';
import {waitFor} from "@testing-library/react";
import {approveContent, deleteContent, getUnapprovedContent} from "../../main/request/content.ts";


const success = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => null,
} as Response);

const fail = vi.fn().mockRejectedValue(new Error("fail"));

describe("content", () => {
    beforeEach(() => {
        global.fetch = success;
    });

    test("getUnapprovedContent success", async () => {

        await getUnapprovedContent();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/content/unapproved",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );
        });
    })

    test("getUnapprovedContent fail", async () => {

        global.fetch = fail;

        const res = await getUnapprovedContent();

        expect(res).toStrictEqual([]);
    })

    test("approveContent success", async () => {

        await approveContent(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/content/1",
                expect.objectContaining({
                    method: "PATCH",
                    credentials: "include",
                })
            );
        });
    })

    test("approveContent fail", async () => {

        global.fetch = fail;

        const res = await approveContent(1);

        expect(res).toStrictEqual(null);
    })

    test("deleteContent success", async () => {

        const res = await deleteContent(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/content/1",
                expect.objectContaining({
                    method: "DELETE",
                    credentials: "include",
                })
            );

            expect(res).toStrictEqual(true);
        });
    })

    test("deleteContent fail", async () => {

        global.fetch = fail;

        const res = await deleteContent(1);

        expect(res).toStrictEqual(false);
    })
});
