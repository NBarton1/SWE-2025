import type {ReactNode} from "react";
import {type MatchResponse} from "../../types/match.ts";
import { type UpdateMatchRequest } from "../../request/matches.ts";

export abstract class MatchStateHandler {
    protected matchResponse: MatchResponse;

    constructor(match: MatchResponse) {
        this.matchResponse = match;
    }

    abstract getTitleSuffix(): ReactNode;
    abstract getEditControls(
        updateMatch: (req: UpdateMatchRequest) => void
    ): ReactNode;
}
