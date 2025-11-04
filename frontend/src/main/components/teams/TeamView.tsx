import { useEffect, useState } from "react";
import {Box, Card, Divider, Group, ScrollArea, Stack, Table, Title, Text} from "@mantine/core";
import { getTeam, getTeamPlayers, getTeamCoaches } from "../../request/teams";
import {type Team} from "../../types/team";
import type { Player, Coach } from "../../types/accountTypes";
import { useParams } from "react-router-dom";
import {formatLikePCT, getLikePCT} from "../../types/util.ts";

const TeamView = () => {
    const { id } = useParams<{ id: string }>();
    const teamId = id ? parseInt(id, 10) : 0;
    const [team, setTeam] = useState<Team | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            getTeam(teamId),
            getTeamPlayers(teamId),
            getTeamCoaches(teamId),
        ]).then(([teamData, playerData, coachData]) => {
            setTeam(teamData);
            setPlayers(playerData);
            setCoaches(coachData);
        });
    }, [id]);

    if (!team) return <Text>Team not found</Text>

    return (
        <Box p="xl">
            <Stack gap="md">
                <Card withBorder>
                    <Group justify="space-between">
                        <Title order={2}>{team.name}</Title>
                        <Text c="dimmed">ID: {team.id}</Text>
                    </Group>
                    <Divider my="sm" />
                    <Group>
                        <Text>Wins: {team.win}</Text>
                        <Text>Losses: {team.loss}</Text>
                        <Text>Draws: {team.draw}</Text>
                        <Text>Points For: {team.pointsFor}</Text>
                        <Text>Points Allowed: {team.pointsAllowed}</Text>
                    </Group>
                </Card>

                <Card withBorder>
                    <Title order={4}>Coaches</Title>
                    <ScrollArea h={200}>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Username</Table.Th>
                                    <Table.Th>Rating</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {coaches
                                    .sort((c0, c1) => getLikePCT(c0.likes, c0.dislikes) - getLikePCT(c1.likes, c1.dislikes))
                                    .map(coach => (
                                        <Table.Tr>
                                            <Table.Td>{coach.account.name}</Table.Td>
                                            <Table.Td>{coach.account.username}</Table.Td>
                                            <Table.Td>{formatLikePCT(coach.likes, coach.dislikes)}</Table.Td>
                                        </Table.Tr>
                                    ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Card>

                <Card withBorder>
                    <Title order={4}>Players</Title>
                    <ScrollArea h={300}>
                        <Table striped highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Username</Table.Th>
                                    <Table.Th>Position</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {players.map(player =>
                                    <Table.Tr>
                                        <Table.Td>{player.account.name}</Table.Td>
                                        <Table.Td>{player.account.username}</Table.Td>
                                        <Table.Td>{player.position}</Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Card>
            </Stack>
        </Box>
    );
};

export default TeamView;
