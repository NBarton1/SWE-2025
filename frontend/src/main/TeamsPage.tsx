import { useEffect, useState } from "react";
import {
    Table,
    Paper,
    Title,
    Box,
    ScrollArea,
    Flex,
} from "@mantine/core";
import {formatPCT, getPCT, type Team} from "./schedule/team.ts";
import {getTeams} from "./request/teams.ts";


const TeamTablePage = () => {

    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        getTeams().then(setTeams)
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
                <Flex justify="space-between" align="center" style={{marginBottom: "1rem", gap: "12px"}}>
                    <Title order={2} data-test-id="teams-title">Team Standings</Title>
                </Flex>
                <ScrollArea h="80vh">
                    <Table
                        highlightOnHover
                        striped
                        stickyHeader
                        verticalSpacing="sm"
                        horizontalSpacing="md"
                        data-test-id="teams-table"
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
                            {teams.sort((t0, t1) => getPCT(t1) - getPCT(t0)).map((team, index) => (
                                <Table.Tr key={`${team.id}-${index}`}>
                                    <Table.Td>{team.name}</Table.Td>
                                    <Table.Td>{team.win}</Table.Td>
                                    <Table.Td>{team.loss}</Table.Td>
                                    <Table.Td>{team.draw}</Table.Td>
                                    <Table.Td>{formatPCT(team)}</Table.Td>
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

export default TeamTablePage;
