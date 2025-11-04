import {Divider, Paper, Stack, Title} from "@mantine/core";
import LiveMatchClockEdit from "./LiveMatchClockEdit.tsx";
import TeamScoreEdit from "./TeamScoreEdit.tsx";
import type {Match} from "../../types/match.ts";
import {type UpdateMatchRequest} from "../../request/matches.ts";

interface LiveMatchEditProps {
    match: Match,
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

const LiveMatchEdit = ({ match, updateLiveMatch }: LiveMatchEditProps) => {

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="md">
                <Title ta="center" order={3}>
                    {`${match.awayTeam.name} @ ${match.homeTeam.name} Live Feed`}
                </Title>

                <Divider labelPosition="center" />

                {match && <Stack gap="md">
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
