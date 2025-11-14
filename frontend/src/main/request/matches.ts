import {Match, type MatchResponse} from "../types/match.ts";

export interface MatchRequestFields {
    matchId: number
    type: string;
    homeTeamId: string;
    awayTeamId: string;
    date: string;
    homeScore: number,
    awayScore: number,
    timeLeft: number,
    toggleClock: boolean,
    state: string,
}

export type CreateMatchRequest = Partial<MatchRequestFields>;
export type UpdateMatchRequest = Partial<MatchRequestFields>;

const URL = "http://localhost:8080/api/matches";


export async function createMatch(req: CreateMatchRequest) {

    const res = await fetch(URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    });

    const matchRes: MatchResponse = await res.json();

    return new Match(matchRes);
}

export async function updateMatch(req: UpdateMatchRequest) {

    const { matchId, ...fields } = req;

    const res = await fetch(`${URL}/${req.matchId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fields)
    });

    const matchRes: MatchResponse = await res.json();

    return new Match(matchRes);
}

export async function deleteMatch(matchId: number) {

    return fetch(`${URL}/${matchId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export async function getMatch(matchId: number) {

    const res = await fetch(`${URL}/${matchId}`, {
        method: "GET",
        credentials: "include"
    });

    const matchRes: MatchResponse = await res.json();

    return new Match(matchRes);
}

export const getMatches = async () => {
    try {
        const res = await fetch(URL, {
            method: "GET",
            credentials: "include"
        });

        const matchesResponse: MatchResponse[] = await res.json();

        return matchesResponse.map(matchRes => new Match(matchRes));
    } catch (err) {
        console.error("Failed to get matches", err);
        return [];
    }
}
