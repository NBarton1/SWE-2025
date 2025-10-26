import type {Team} from "./team.ts";


export interface Match {
    id: number,
    type: string,
    date: string,
    homeTeam: Team,
    awayTeam: Team
}


// @ts-expect-error non erasable syntax
export enum MatchType {
    PLAYOFF = "PLAYOFF",
    STANDARD = "STANDARD"
}

export function matchDate(match: Match) {
    return match.date.substring(0, match.date.indexOf("T"))
}

export function matchTime(match: Match) {
    return match.date.substring(match.date.indexOf("T") + 1)
}

export function matchStr(match: Match) {
    return `${match.awayTeam.name} @ ${match.homeTeam.name}`
}
