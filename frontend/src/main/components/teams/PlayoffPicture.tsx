import { useEffect, useState } from "react";
import {
    Paper,
    Title,
    Box,
    Text, Stack
} from "@mantine/core";
import {type Team} from "../../types/team.ts";
import {getPlayoffTeams} from "../../request/teams.ts";
import TeamStandingsTable from "./TeamStandingsTable.tsx";
import { Trophy } from 'lucide-react';


const PlayoffPicture = () => {

    const [playoffTeams, setPlayoffTeams] = useState<Team[] | null>(null);

    useEffect(() => {
        getPlayoffTeams().then(setPlayoffTeams)
    }, []);

    return (
        <Box
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Paper
                radius="md"
                p="xl"
                style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                }}
            >
                <Title order={2} data-testid="playoff-title">Playoff Picture</Title>

                {playoffTeams &&
                    (playoffTeams.length ? (
                        <TeamStandingsTable teams={playoffTeams} />
                    ) : (
                        <Stack align="center" justify="center" py="xl" gap="md">
                            <Trophy size="5%" color="var(--mantine-color-dimmed)" />
                            <Text size="xl" fw={500} c="dimmed" ta="center">
                                Playoff Picture appears when all teams have
                                completed 2 matches against each other team
                            </Text>
                        </Stack>
                    ))
                }
            </Paper>
        </Box>
    );
};

export default PlayoffPicture;
