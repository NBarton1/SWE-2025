import { vi, beforeEach, describe, test, expect } from "vitest";
import { waitFor } from "@testing-library/react";
import {
    createTeam,
    getTeams,
    getTeam,
    assignCoachToTeam,
    getTeamPlayers,
    getTeamCoaches,
    invitePlayerFromTeam,
    removePlayerFromTeam,
    type TeamCreateRequest,
} from "../../main/request/teams.ts";
import {coachDK, mockPlayer, mockTeamDK} from "../../../vitest.setup.tsx";


const success = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockTeamDK,
} as Response);

const fail = vi.fn().mockRejectedValue(new Error("fail"));

describe("teams", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = success;
    });

    test("createTeam success", async () => {
        const req: TeamCreateRequest = { name: "DK Team" };
        await createTeam(req);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/teams",
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(req),
                })
            );
        });
    });

    test("getTeams success", async () => {
        await getTeams();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/teams",
                expect.objectContaining({ method: "GET", credentials: "include" })
            );
        });
    });

    test("getTeams fail", async () => {
        global.fetch = fail;

        const res = await getTeams();
        expect(res).toStrictEqual([]);
    });

    test("getTeam success", async () => {
        await getTeam(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/teams/1",
                expect.objectContaining({ method: "GET", credentials: "include" })
            );
        });
    });

    test("getTeam fail", async () => {
        global.fetch = fail;

        const res = await getTeam(1);
        expect(res).toBeNull();
    });

    test("assignCoachToTeam success", async () => {
        await assignCoachToTeam(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/teams/1/coaches",
                expect.objectContaining({
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
            );
        });
    });

    test("assignCoachToTeam fail", async () => {
        global.fetch = fail;

        const res = await assignCoachToTeam(1);
        expect(res).toBeNull();
    });

    test("getTeamPlayers success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [mockPlayer],
        } as Response);

        const res = await getTeamPlayers(1);
        expect(res).toEqual([mockPlayer]);
    });

    test("getTeamPlayers fail", async () => {
        global.fetch = fail;

        const res = await getTeamPlayers(1);
        expect(res).toStrictEqual([]);
    });

    test("getTeamCoaches success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [coachDK],
        } as Response);

        const res = await getTeamCoaches(1);
        expect(res).toEqual([coachDK]);
    });

    test("getTeamCoaches fail", async () => {
        global.fetch = fail;

        const res = await getTeamCoaches(1);
        expect(res).toStrictEqual([]);
    });

    test("invitePlayerFromTeam", async () => {
        await invitePlayerFromTeam(2);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/teams/2/invite",
                expect.objectContaining({ method: "POST", credentials: "include" })
            );
        });
    });

    test("removePlayerFromTeam success", async () => {

        const res = await removePlayerFromTeam(2);
        expect(res).toBe(true);
    });

    test("removePlayerFromTeam fail", async () => {
        global.fetch = fail;

        const res = await removePlayerFromTeam(2);
        expect(res).toBe(false);
    });
});
