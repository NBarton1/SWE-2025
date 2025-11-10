import {beforeEach, expect, vi} from "vitest";
import {waitFor} from "@testing-library/react";
import {adoptPlayer, searchPlayers, setPlayerPermission} from "../../main/request/players.ts";


const fail = vi.fn().mockRejectedValue(new Error("fail"));

describe("players", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => null,
        } as Response);
    });

    test("searchPlayers success", async () => {

        await searchPlayers();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/players", expect.objectContaining({
                    method: "POST",
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'},
                })
            )
        });
    })

    test("searchPlayers fail", async () => {

        global.fetch = fail;

        const res = await searchPlayers();

        expect(res).toStrictEqual([]);
    })

    test("adoptPlayer success", async () => {

        await adoptPlayer(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/api/players/1/adopt`, {
                method: "POST",
                credentials: "include",
            })
        });
    })

    test("adoptPlayer fail", async () => {

        global.fetch = fail;

        const res = await adoptPlayer(1);

        expect(res).toStrictEqual(null);
    })

    test("setPlayerPermission success", async () => {

        await setPlayerPermission(1, true);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/api/players/1/permission`, expect.objectContaining({
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ hasPermission: true }),
                })
            );
        });
    })

    test("setPlayerPermission fail", async () => {

        global.fetch = fail;

        const res = await setPlayerPermission(1, true);

        expect(res).toStrictEqual(null);
    })
})
