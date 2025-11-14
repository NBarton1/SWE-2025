import {beforeEach, expect, vi} from "vitest";
import {waitFor} from "@testing-library/react";
import {getInvites, type PlayerInviteRequest, respondToInvite} from "../../main/request/invites.ts";


const fail = vi.fn().mockRejectedValue(new Error("fail"));

describe("invites", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => null,
        } as Response);
    });

    test("getInvites success", async () => {

        await getInvites();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/players/invites",
                expect.objectContaining({
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            )
        });
    })

    test("getInvites fail", async () => {

        global.fetch = fail;

        const res = await getInvites();

        expect(res).toStrictEqual([]);
    })

    test("respondToInvite success", async () => {
        let req: PlayerInviteRequest = {
            isAccepted: true
        }
        await respondToInvite(1, req);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/api/players/invites/1`,
                expect.objectContaining({
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(req),
                })
            )
        });
    })

    test("respondToInvite fail", async () => {

        global.fetch = fail;

        let req: PlayerInviteRequest = {
            isAccepted: true
        }
        const res = await respondToInvite(1, req);

        expect(res).toStrictEqual(null);
    })
})
