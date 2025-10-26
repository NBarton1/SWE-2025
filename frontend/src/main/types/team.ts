export interface Team {
    id: number,
    name: string,
    pointsAllowed: number
    pointsFor: number,
    win: number
    draw: number
    loss: number
}


export function getPCT(team: Team): number {
    return (team.win + team.draw / 2) / (team.win + team.loss + team.draw);
}

export function formatPCT(team: Team) {
    const pct = getPCT(team);

    return isNaN(pct) ? "-" : pct.toFixed(3).replace(/^0/, "");
}
