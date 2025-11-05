import {Divider, Paper, Stack} from "@mantine/core";
import LiveMatchClockEdit from "./LiveMatchClockEdit.tsx";
import TeamScoreEdit from "./TeamScoreEdit.tsx";
import {type Match, MatchState} from "../../types/match.ts";
import {type UpdateMatchRequest} from "../../request/matches.ts";
import MatchEditState from "./LiveMatchEditState.tsx";
import MatchTitle from "./MatchTitle.tsx";

interface LiveMatchEditProps {
    match: Match,
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

const LiveMatchEdit = ({ match, updateLiveMatch }: LiveMatchEditProps) => {

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="md">
                <MatchTitle match={match} />

                <Divider labelPosition="center" />

                <MatchEditState match={match} updateLiveMatch={updateLiveMatch} />

                {match && match.state == MatchState.LIVE && <Stack gap="md">
                    <TeamScoreEdit
                        team={match.awayTeam}
                        score={match.awayScore}
                        updateScore={(awayScore) => updateLiveMatch({ awayScore })}
                    />

                    <TeamScoreEdit
                        team={match.homeTeam}
                        score={match.homeScore}
                        updateScore={(homeScore) => updateLiveMatch({ homeScore })}
                    />

                    <LiveMatchClockEdit match={match} updateLiveMatch={updateLiveMatch} />
                </Stack>}
            </Stack>
        </Paper>
    );
};

export default LiveMatchEdit;
