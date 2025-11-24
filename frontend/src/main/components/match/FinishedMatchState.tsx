import type {ReactNode} from "react";
import { Text } from "@mantine/core";
import { type UpdateMatchRequest } from "../../request/matches.ts";
import MatchEditState from "./MatchEditState.tsx";
import {MatchStateHandler} from "./MatchStateHandler.tsx";


export class FinishedMatchState extends MatchStateHandler {
    getTitleSuffix(): ReactNode {
        const date = new Date(this.matchResponse.date);
        const dateStr = date.toLocaleString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        return (
            <Text
                span
                ml={8}
                inherit
                data-testid="match-title-finished"
            >
                ● Final - {dateStr}
            </Text>
        );
    }

    getEditControls(
        updateMatch: (req: UpdateMatchRequest) => void
    ): ReactNode {
        return (
            <MatchEditState
                match={this.matchResponse}
                updateMatch={updateMatch}
            />
        );
    }
}
