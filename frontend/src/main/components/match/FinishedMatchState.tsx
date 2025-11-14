import type {ReactNode} from "react";
import { Text } from "@mantine/core";
import { type UpdateMatchRequest } from "../../request/matches.ts";
import MatchEditState from "./MatchEditState.tsx";
import {MatchStateHandler} from "./MatchStateHandler.tsx";


export class FinishedMatchState extends MatchStateHandler {
    getTitleSuffix(): ReactNode {
        return (
            <Text
                span
                ml={8}
                inherit
                data-testid="match-title-finished"
            >
                ● Final
            </Text>
        );
    }

    getEditControls(
        updateMatch: (req: UpdateMatchRequest) => void
    ): ReactNode {
        return (
            <MatchEditState
                match={this.match}
                updateMatch={updateMatch}
            />
        );
    }
}
