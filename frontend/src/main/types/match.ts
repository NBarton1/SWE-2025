import type {Team} from "./team.ts";
import type {MatchStateHandler} from "../components/match/MatchStateHandler.tsx";
import {ScheduledMatchState} from "../components/match/ScheduledMatchState.tsx";
import {LiveMatchState} from "../components/match/LiveMatchState.tsx";
import {FinishedMatchState} from "../components/match/FinishedMatchState.tsx";
import type {UpdateMatchRequest} from "../request/matches.ts";


export interface MatchResponse {
    id: number,
    type: string,
    date: string,
    homeTeam: Team,
    awayTeam: Team,
    homeScore: number,
    awayScore: number,
    clockTimestamp: number,
    timeRunning: boolean,
    state: string,
}

export class Match {
    matchRes: MatchResponse;
    private stateHandler: MatchStateHandler;

    constructor(matchRes: MatchResponse) {
        this.matchRes = matchRes;

        switch (matchRes.state) {
            case MatchState.SCHEDULED:
                this.stateHandler = new ScheduledMatchState(matchRes);
                break;
            case MatchState.LIVE:
                this.stateHandler = new LiveMatchState(matchRes);
                break;
            case MatchState.FINISHED:
                this.stateHandler = new FinishedMatchState(matchRes);
                break;
            default:
                throw new Error(`Invalid match state: ${matchRes.state}`);
        }
    }

    getId() {
        return this.matchRes.id;
    }

    getTitleSuffix() {
        return this.stateHandler.getTitleSuffix();
    }

    getEditControls(updateMatch: (req: UpdateMatchRequest) => void) {
        return this.stateHandler.getEditControls(updateMatch);
    }

    getTitle() {
        const matchRes = this.matchRes;

        if (matchRes.state == MatchState.SCHEDULED) {
            return this.getTeams();
        }

        return `${matchRes.awayTeam.name} ${matchRes.awayScore} - ${matchRes.homeScore} ${matchRes.homeTeam.name}`
    }

    getTeams() {
        const matchRes = this.matchRes;
        return `${matchRes.awayTeam.name} @ ${matchRes.homeTeam.name}`
    }

    getHomeTeam() {
        return this.matchRes.homeTeam;
    }

    getAwayTeam() {
        return this.matchRes.awayTeam;
    }

    getHomeScore() {
        return this.matchRes.homeScore;
    }

    getAwayScore() {
        return this.matchRes.awayScore;
    }

    getDateTime() {
        return this.matchRes.date;
    }

    getDate() {
        const date = this.matchRes.date;
        return date.substring(0, date.indexOf("T"))
    }

    getTime() {
        const date = this.matchRes.date;
        return date.substring(date.indexOf("T") + 1)
    }

    getType() {
        return this.matchRes.type;
    }

    getHomeTeamId() {
        return this.matchRes.homeTeam.id;
    }

    getAwayTeamId() {
        return this.matchRes.awayTeam.id;
    }

    cmp(other: Match) {
        const timeDiff = this.startTime() - other.startTime();
        return timeDiff ? timeDiff : this.getTitle().localeCompare(other.getTitle());
    }

    private startTime() {
        return new Date(this.matchRes.date).getTime();
    }
}


// @ts-expect-error non erasable syntax
export enum MatchType {
    PLAYOFF = "PLAYOFF",
    STANDARD = "STANDARD"
}

// @ts-expect-error non erasable syntax
export enum MatchState {
    SCHEDULED = "SCHEDULED",
    LIVE = "LIVE",
    FINISHED = "FINISHED"
}
