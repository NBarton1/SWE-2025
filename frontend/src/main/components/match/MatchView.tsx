import {Divider, Group, Paper, Stack} from "@mantine/core";
import {Match} from "../../types/match.ts";
import TeamScoreView from "./TeamScoreView.tsx";
import LiveMatchClockView from "./LiveMatchClockView.tsx";
import MatchTitle from "./MatchTitle.tsx";
import {useNavigate} from "react-router";


interface MatchViewProps {
    match: Match
    navigable: boolean
    borderless?: boolean
}

const MatchView = ({ match, navigable, borderless}: MatchViewProps) => {
    if (!match) return null;

    const navigate = useNavigate();

    const handleClick = () => {
        if (navigable) {
            navigate(`/match/${match.getId()}`);
        }
    };

    return (
        <Group gap="xs" wrap="nowrap" align="flex-start">
            <Paper
                p="lg"
                radius="lg"
                withBorder={borderless === undefined || !borderless}
                style={{ flex: 1 }}
                data-testid={`live-match-view-${match.getId()}`}
                onClick={handleClick}
            >
                <Stack gap="md">
                    <MatchTitle match={match} />

                    <Divider labelPosition="center" />

                    <Stack gap="xs">
                        <TeamScoreView team={match.getAwayTeam()} score={match.getAwayScore()} />
                        <TeamScoreView team={match.getHomeTeam()} score={match.getHomeScore()} />
                    </Stack>

                    <Divider labelPosition="center" />

                    <LiveMatchClockView match={match} />
                </Stack>
            </Paper>
        </Group>
    );
};

export default MatchView;
