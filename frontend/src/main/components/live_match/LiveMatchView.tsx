import {Divider, Paper, Stack} from "@mantine/core";
import {type Match} from "../../types/match.ts";
import TeamScoreView from "./TeamScoreView.tsx";
import LiveMatchClockView from "./LiveMatchClockView.tsx";
import MatchTitle from "./MatchTitle.tsx";

interface LiveMatchEditProps {
    match: Match,
}

const LiveMatchView = ({ match }: LiveMatchEditProps) => {
    if (!match) return null;

    return (
        <Paper shadow="md" p="lg" radius="lg" withBorder>
            <Stack gap="md">
                <MatchTitle match={match} />

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
