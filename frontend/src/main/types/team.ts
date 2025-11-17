export interface Team {
    id: number,
    name: string,
    pointsAllowed: number
    pointsFor: number,
    win: number
    draw: number
    loss: number
    pct: number
}

export function formatTeamPCT(team: Team) {
    const pct = team.pct;

    return isNaN(pct) ? "-" : pct.toFixed(3).replace(/^0/, "");
}
