export interface Team {
    id: number,
    name: string,
    pointsAllowed: number
    pointsFor: number,
    win: number
    draw: number
    loss: number
}


export function getTeamPCT(team: Team): number {
    return (team.win + team.draw / 2) / (team.win + team.loss + team.draw);
}

export function formatTeamPCT(team: Team) {
    const pct = getTeamPCT(team);

    return isNaN(pct) ? "-" : pct.toFixed(3).replace(/^0/, "");
}
