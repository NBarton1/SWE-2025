import { useEffect, useState } from "react";
import {Container, Paper, Title, Button, Divider, Stack} from "@mantine/core";
import { type Match } from "../../types/match.ts";
import {getMatches} from "../../request/matches.ts";
import MatchTitle from "../live_match/MatchTitle.tsx";
import TeamScoreView from "../live_match/TeamScoreView.tsx";
import LiveMatchClockView from "../live_match/LiveMatchClockView.tsx";


const ScheduleList = () => {
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        getMatches().then(setMatches);
    }, []);

    return (
        <Container py="md">
            <Paper shadow="md" p="md" radius="md" data-testid="schedule-paper">

                <Button component="a" href="/calendar" >
                    Calendar View
                </Button>

                <Title order={2} mb="md" ta="center" data-testid="schedule-title">
                    Schedule
                </Title>

                <Stack gap="md">
                {matches.map((match) => (
                    <Paper shadow="xs" p="xl" bg="dark.8">
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
                ))}
                </Stack>

            </Paper>

        </Container>
    );
};

export default ScheduleList;

