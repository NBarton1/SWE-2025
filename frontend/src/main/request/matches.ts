export interface MatchRequestFields {
    matchId: number
    type: string;
    homeTeamId: string;
    awayTeamId: string;
    date: string;
    homeScore: number,
    awayScore: number,
    timeLeft: string,
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

    return res.json();
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

    return res.json();
}

export async function deleteMatch(matchId: number) {

    return fetch(`${URL}/${matchId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const getMatches = async () => {
    try {
        const res = await fetch(URL, {
            method: "GET",
            credentials: "include"
        });

        return res.json();
    } catch (err) {
        console.error("Failed to get matches", err);
        return [];
    }
}
