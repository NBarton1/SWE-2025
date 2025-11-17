import {Divider, Paper, Stack} from "@mantine/core";
import {Match} from "../../types/match.ts";
import TeamScoreView from "./TeamScoreView.tsx";
import LiveMatchClockView from "./LiveMatchClockView.tsx";
import MatchTitle from "./MatchTitle.tsx";
import {useNavigate} from "react-router";

interface MatchViewProps {
    match: Match,
    navigable: boolean
}

const MatchView = ({ match, navigable }: MatchViewProps) => {
    if (!match) return null;

    const navigate = useNavigate();

    const handleClick = () => {
        if (navigable) {
            navigate(`/match/${match.matchRes.id}`);
        }
    };

    return (
        <Paper
            shadow="md"
            p="lg"
            radius="lg" withBorder
            data-testid={`live-match-view-${match.matchRes.id}`}
            onClick={handleClick}
        >
            <Stack gap="md">
                <MatchTitle match={match} />

                <Divider labelPosition="center" />

                <Stack gap="xs">
                    <TeamScoreView team={match.matchRes.awayTeam} score={match.matchRes.awayScore} />
                    <TeamScoreView team={match.matchRes.homeTeam} score={match.matchRes.homeScore} />
                </Stack>

                <Divider />

                <LiveMatchClockView match={match} />
            </Stack>
        </Paper>
    );
};

export default MatchView;
