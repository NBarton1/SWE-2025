import type {ReactNode} from "react";
import { Text, Stack } from "@mantine/core";
import { type UpdateMatchRequest } from "../../request/matches.ts";
import LiveMatchClockEdit from "./LiveMatchClockEdit.tsx";
import TeamScoreEdit from "./TeamScoreEdit.tsx";
import MatchEditState from "./MatchEditState.tsx";
import {MatchStateHandler} from "./MatchStateHandler.tsx";


export class LiveMatchState extends MatchStateHandler {
    getTitleSuffix(): ReactNode {
        return (
            <Text
                span
                c="red"
                ml={8}
                inherit
                data-testid="match-title-live"
            >
                ● LIVE!
            </Text>
        );
    }

    getEditControls(
        updateMatch: (req: UpdateMatchRequest) => void
    ): ReactNode {
        return (
            <>
                <MatchEditState
                    match={this.match}
                    updateMatch={updateMatch}
                />

                <Stack
                    gap="md"
                    data-testid="team-scores-stack"
                >

                    <TeamScoreEdit
                        team={this.match.awayTeam}
                        score={this.match.awayScore}
                        updateScore={(awayScore) => updateMatch({ awayScore })}
                    />

                    <TeamScoreEdit
                        team={this.match.homeTeam}
                        score={this.match.homeScore}
                        updateScore={(homeScore) => updateMatch({ homeScore })}
                    />

                    <LiveMatchClockEdit
                        match={this.match}
                        updateLiveMatch={updateMatch}
                    />

                </Stack>
            </>
        );
    }
}
