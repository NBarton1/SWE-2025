import type {ReactNode} from "react";
import {Text} from "@mantine/core";
import type {UpdateMatchRequest} from "../../request/matches.ts";
import MatchEditState from "./MatchEditState.tsx";
import {MatchStateHandler} from "./MatchStateHandler.tsx";

export class ScheduledMatchState extends MatchStateHandler {
    getTitleSuffix(): ReactNode {
        const date = new Date(this.match.date);
        const dateStr = date.toLocaleString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        return (
            <Text
                span
                ml={8}
                inherit
                data-testid="match-title-scheduled"
            >
                ● {dateStr}
            </Text>
        );
    }

    getEditControls(
        updateLiveMatch: (req: UpdateMatchRequest) => void
    ): ReactNode {
        return (
            <MatchEditState
                match={this.match}
                updateMatch={updateLiveMatch}
            />
        );
    }
}
