import {type Match, MatchState} from "../../types/match.ts";
import {Title, Text} from "@mantine/core";

interface MatchTitleProps {
    match: Match
}

const MatchTitle = ({ match }: MatchTitleProps) => {
    const date = new Date(match.date);

    const dateStr = date.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Title
            order={3}
            ta="center"
            data-testid="match-title"
        >
            {`${match.awayTeam.name} @ ${match.homeTeam.name}`}
            {match.state == MatchState.SCHEDULED && (
                <Text
                    span
                    ml={8}
                    inherit
                    data-testid="match-title-scheduled"
                >
                    ● {dateStr}
                </Text>
            )}
            {match.state == MatchState.LIVE && (
                <Text
                    span
                    c="red"
                    ml={8}
                    inherit
                    data-testid="match-title-live"
                >
                    ● LIVE!
                </Text>
            )}
            {match.state == MatchState.FINISHED && (
                <Text
                    span
                    ml={8}
                    inherit
                    data-testid="match-title-finished"
                >
                    ● Final
                </Text>
            )}
        </Title>
    );
};

export default MatchTitle;
