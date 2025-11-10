import {Divider, Paper, Stack} from "@mantine/core";
import {type Match} from "../../types/match.ts";
import TeamScoreView from "./TeamScoreView.tsx";
import LiveMatchClockView from "./LiveMatchClockView.tsx";
import MatchTitle from "./MatchTitle.tsx";
import {useNavigate} from "react-router";

interface LiveMatchViewProps {
    match: null | Match,
    navigable: boolean
}

const LiveMatchView = ({ match, navigable }: LiveMatchViewProps) => {
    if (!match) return null;

    const navigate = useNavigate();

    const handleClick = () => {
        if (navigable) {
            navigate(`/match/${match.id}`);
        }
    };

    return (
        <Paper
            shadow="md"
            p="lg"
            radius="lg" withBorder
            data-testid="live-match-view"
            onClick={handleClick}
        >
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
