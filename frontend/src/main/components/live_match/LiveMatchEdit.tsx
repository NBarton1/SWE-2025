import {Paper, Stack} from "@mantine/core";
import MatchClock from "./MatchClock.tsx";
import TeamScore from "./TeamScore.tsx";
import type {Match} from "../../types/match.ts";
import {type UpdateMatchRequest} from "../../request/matches.ts";

interface LiveMatchEditProps {
    match: Match,
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

const LiveMatchEdit = ({ match, updateLiveMatch }: LiveMatchEditProps) => {

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            {match && <Stack gap="md">
                <TeamScore
                    team={match.awayTeam}
                    score={match.awayScore}
                    updateScore={(awayScore) => updateLiveMatch({ awayScore })}
                />
                <TeamScore
                    team={match.homeTeam}
                    score={match.homeScore}
                    updateScore={(homeScore) => updateLiveMatch({ homeScore })}
                />
                <MatchClock match={match} updateLiveMatch={updateLiveMatch} />
            </Stack>}
        </Paper>
    );
};

export default LiveMatchEdit;
