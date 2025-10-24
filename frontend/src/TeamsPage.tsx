import { useEffect, useState } from "react";
import {
    Table,
    Paper,
    Title,
    Box,
    useMantineTheme,
    ScrollArea,
    Flex,
} from "@mantine/core";
import type {Team} from "./schedule/team.ts";
import {getTeams} from "./request/teams.ts";

interface TeamTablePage {
    jwt: string
}

const TeamTablePage = ({ jwt }: TeamTablePage) => {
    const theme = useMantineTheme();

    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        getTeams(jwt).then(setTeams)
    }, [jwt]);

    return (
        <Box
            style={{
                minHeight: "100vh",
                padding: "3rem 0",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Paper
                shadow="md"
                radius="md"
                p="xl"
                style={{
                    width: "90%",
                    maxWidth: 1000,
                    border: `1px solid ${theme.colors[theme.primaryColor][4]}`,
                }}
            >
                <Flex justify="space-between" align="center" style={{ marginBottom: "1rem", gap: "12px" }}>
                    <Title order={2}>Team Standings</Title>
                </Flex>

                <ScrollArea>
                    <Table highlightOnHover striped verticalSpacing="sm" horizontalSpacing="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Team Name</Table.Th>
                                <Table.Th>Points For</Table.Th>
                                <Table.Th>Points Allowed</Table.Th>
                                <Table.Th>Win</Table.Th>
                                <Table.Th>Draw</Table.Th>
                                <Table.Th>Loss</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {teams.map((team) => (
                                <Table.Tr key={team.id}>
                                    <Table.Td>{team.id}</Table.Td>
                                    <Table.Td>{team.name}</Table.Td>
                                    <Table.Td>{team.pointsFor}</Table.Td>
                                    <Table.Td>{team.pointsAllowed}</Table.Td>
                                    <Table.Td>{team.win}</Table.Td>
                                    <Table.Td>{team.draw}</Table.Td>
                                    <Table.Td>{team.loss}</Table.Td>
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
