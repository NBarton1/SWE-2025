import type {Team} from "./team.ts";


export interface Match {
    id: Number,
    type: Number,
    date: string,
    homeTeam: Team,
    awayTeam: Team
}

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
