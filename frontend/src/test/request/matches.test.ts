import { vi, beforeEach } from 'vitest';
import {MatchType} from "../../main/types/match.ts";
import {waitFor} from "@testing-library/react";
import {
    createMatch,
    type CreateMatchRequest,
    deleteMatch, getMatch,
    getMatches,
    updateMatch,
    type UpdateMatchRequest
} from "../../main/request/matches.ts";
import {mockScheduledMatch} from "../../../vitest.setup.tsx";


describe("matches", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockScheduledMatch,
        } as Response);
    });

    test("createMatch test", async () => {

        let req: CreateMatchRequest = {
            type: MatchType.STANDARD,
            homeTeamId: "1",
            awayTeamId: "2",
            date: "2026-03-14TT12:00",
        }

        await createMatch(req);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/matches",
                expect.objectContaining({
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
            );
        });
    })

    test("updateMatch test", async () => {
        let req: UpdateMatchRequest = {
            matchId: 1,
            type: MatchType.STANDARD,
        }

        await updateMatch(req);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/matches/1",
                expect.objectContaining({
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
            );
        });
    })

    test("deleteMatch test", async () => {
        await deleteMatch(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/matches/1",
                expect.objectContaining({
                    method: "DELETE",
                    credentials: "include",
                })
            );
        });
    })

    test("getMatches test", async () => {
        await getMatches();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/matches",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );
        });
    })

    test("getMatch", async () => {
        await getMatch(1);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/matches/1",
                expect.objectContaining({
                    method: "GET",
                    credentials: "include",
                })
            );
        });
    })
});
