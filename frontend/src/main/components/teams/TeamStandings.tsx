import { useEffect, useState } from "react";
import {
    Table,
    Paper,
    Title,
    Box,
    ScrollArea,
    Flex, Button,
} from "@mantine/core";
import {formatTeamPCT, getTeamPCT, type Team} from "../../types/team.ts";
import {getTeams} from "../../request/teams.ts";
import {useNavigate} from "react-router";
import useLogin from "../../hooks/useLogin.tsx";
import {hasRole, Role} from "../../types/accountTypes.ts";
import TeamCreateModal from "./TeamCreateModal.tsx";


const TeamStandings = () => {

    const [teams, setTeams] = useState<Team[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate()
    const {currentAccount} = useLogin()

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

                    {currentAccount && hasRole(currentAccount, Role.COACH) && (
                        <Button onClick={() => setModalOpen(true)}>Create Team</Button>
                    )}
                </Flex>

                <TeamCreateModal opened={modalOpen} onClose={() => setModalOpen(false)} onTeamCreated={handleTeamCreated} />

                <ScrollArea h="80vh">
                    <Table
                        highlightOnHover
                        striped
                        stickyHeader
                        verticalSpacing="sm"
                        horizontalSpacing="md"
                        data-testid="teams-table"
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Team</Table.Th>
                                <Table.Th>Win</Table.Th>
                                <Table.Th>Loss</Table.Th>
                                <Table.Th>Draw</Table.Th>
                                <Table.Th>PCT</Table.Th>
                                <Table.Th>Points For</Table.Th>
                                <Table.Th>Points Allowed</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {teams.sort((t0, t1) => getTeamPCT(t1) - getTeamPCT(t0)).map((team, index) => (
                                <Table.Tr key={`${team.id}-${index}`}>
                                    <Table.Td
                                        onClick={() => navigate(`/teams/${team.id}`)}
                                        style={{ cursor: "pointer", color: "#1c7ed6" }} // blue text
                                        onMouseOver={e => (e.currentTarget.style.textDecoration = "underline")}
                                        onMouseOut={e => (e.currentTarget.style.textDecoration = "none")}
                                    >
                                        {team.name}
                                    </Table.Td>
                                    <Table.Td>{team.win}</Table.Td>
                                    <Table.Td>{team.loss}</Table.Td>
                                    <Table.Td>{team.draw}</Table.Td>
                                    <Table.Td>{formatTeamPCT(team)}</Table.Td>
                                    <Table.Td>{team.pointsFor}</Table.Td>
                                    <Table.Td>{team.pointsAllowed}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </Box>
    );
};

export default TeamStandings;
