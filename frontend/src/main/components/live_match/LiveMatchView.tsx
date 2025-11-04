import {Divider, Paper, Stack, Title} from "@mantine/core";
import type {Match} from "../../types/match.ts";
import TeamScoreView from "./TeamScoreView.tsx";
import LiveMatchClockView from "./LiveMatchClockView.tsx";

interface LiveMatchEditProps {
    match: Match,
}

const LiveMatchView = ({ match }: LiveMatchEditProps) => {
    if (!match) return null;

    return (
        <Paper shadow="md" p="lg" radius="lg" withBorder>
            <Stack gap="md">
                <Title order={3} ta="center">
                    {`${match.awayTeam.name} @ ${match.homeTeam.name}`}
                </Title>

                <Divider labelPosition="center" />

                <Stack gap="xs">
                    <TeamScoreView team={match.awayTeam} score={match.awayScore} />
                    <TeamScoreView team={match.homeTeam} score={match.homeScore} />
                </Stack>

                <Divider />

                <LiveMatchClockView match={match} />
            </Stack>
        </Paper>
    );
};

export default LiveMatchView;
