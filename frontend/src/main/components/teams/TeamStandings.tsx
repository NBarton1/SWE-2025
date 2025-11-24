import { useEffect, useState } from "react";
import {
    Paper,
    Title,
    Box,
    Flex, Button,
} from "@mantine/core";
import {type Team} from "../../types/team.ts";
import {getTeams} from "../../request/teams.ts";
import {isCoach} from "../../types/accountTypes.ts";
import TeamCreateModal from "./TeamCreateModal.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import TeamStandingsTable from "./TeamStandingsTable.tsx";


const TeamStandings = () => {

    const [teams, setTeams] = useState<Team[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const {currentAccount} = useAuth()

    useEffect(() => {
        getTeams().then(setTeams)
    }, []);

    const handleTeamCreated = (newTeam: Team) => {
        setTeams(prev => [...prev, newTeam]); // add new team to state
        setModalOpen(false); // close modal
    };

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
                <Flex justify="space-between" align="center" style={{ marginBottom: "1rem", gap: "12px" }}>
                    <Title order={2} data-testid="teams-title">Team Standings</Title>

                    {isCoach(currentAccount) && (
                        <Button onClick={() => setModalOpen(true)}>Create Team</Button>
                    )}
                </Flex>

                <TeamCreateModal opened={modalOpen} onClose={() => setModalOpen(false)} onTeamCreated={handleTeamCreated} />

                <TeamStandingsTable teams={teams} />
            </Paper>
        </Box>
    );
};

export default TeamStandings;
