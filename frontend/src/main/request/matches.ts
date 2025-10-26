export async function createMatch(
    type: string,
    homeTeamId: string,
    awayTeamId: string,
    time: string,
    date: string
) {

    const res = await fetch("http://localhost:8080/api/matches", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type,
            homeTeamId,
            awayTeamId,
            date: `${date}T${time}`,
        })
    });

    return res.json();
}

export async function updateMatch(
    matchId: number,
    type: string,
    homeTeamId: string,
    awayTeamId: string,
    time: string,
    date: string) {

    const res = await fetch(`http://localhost:8080/api/matches/${matchId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type,
            homeTeamId,
            awayTeamId,
            date: `${date}T${time}`,
        })
    });

    return res.json();
}

export async function deleteMatch(matchId: number) {
    return fetch(`http://localhost:8080/api/matches/${matchId}`, {
        method: "DELETE",
        credentials: "include",
    });
}


export const getMatches = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/matches", {
            method: "GET",
            credentials: "include"
        });
        return res.json();
    } catch (err) {
        console.error("Failed to get matches", err);
        return [];
    }
}
