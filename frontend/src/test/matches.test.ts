import { vi, beforeEach } from 'vitest';
import type {Team} from "../main/types/team.ts";
import type {Match} from "../main/types/match.ts";
import {waitFor} from "@testing-library/react";
import {createMatch, deleteMatch, getMatches, updateMatch} from "../main/request/matches.ts";

global.fetch = vi.fn();

describe("matches", () => {
    beforeEach(() => {
        vi.mocked(global.fetch).mockClear();
    });

    test("createMatch test", async () => {
        const mockCreatedMatch: Match = {
            id: 1,
            type: "regular",
            date: "2024-03-15",
            homeTeam: { id: 1, name: "Team A" } as Team,
            awayTeam: { id: 2, name: "Team B" } as Team,
        };

        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            json: async () => mockCreatedMatch,
        } as Response);

        await createMatch("STANDARD", "1", "2", "12:00", "3-14-26");

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
        await updateMatch(1, "STANDARD", "1", "2", "12:00", "3-14-26");

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
});
