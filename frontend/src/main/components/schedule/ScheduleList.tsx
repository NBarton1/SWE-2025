import { useEffect, useState } from "react";
import {Container, Paper, Title, Button, Stack} from "@mantine/core";
import { type Match } from "../../types/match.ts";
import {getMatches} from "../../request/matches.ts";
import LiveMatchView from "../live_match/LiveMatchView.tsx";


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
                        <LiveMatchView match={match} navigable={true} />
                    ))}
                </Stack>

            </Paper>

        </Container>
    );
};

export default ScheduleList;

