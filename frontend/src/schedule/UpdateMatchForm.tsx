import React, { type Dispatch } from "react";
import { Button, Group, Stack, Paper } from "@mantine/core";
import { type Match, matchTime } from "./match.ts";
import type { Team } from "./team.ts";
import { createBearerAuthHeader } from "../util.ts";
import {useForm} from "@mantine/form";
import MatchFormFields from "./MatchFormFields.tsx";

interface UpdateMatchFormProps {
    match: Match;
    teams: Team[];
    date: string;
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
    jwt: string;
}

const UpdateMatchForm = ({ match, teams, date, matches, setMatches, jwt }: UpdateMatchFormProps) => {

    const matchForm = useForm({
        initialValues: {
            homeTeamId: `${match.homeTeam.id}`,
            awayTeamId: `${match.awayTeam.id}`,
            time: matchTime(match),
            type: match.type
        },
    });

    const updateMatch = async () => {
        try {
            const { type, homeTeamId, awayTeamId, time } = matchForm.values;

            const res = await fetch(`http://localhost:8080/api/matches/${match.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": createBearerAuthHeader(jwt),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type,
                    homeTeamId,
                    awayTeamId,
                    date: `${date}T${time}`,
                })
            });

            const updatedMatch: Match = await res.json();

            setMatches(matches.map(curr_match => curr_match.id === updatedMatch.id ? updatedMatch : curr_match));
        } catch (error) {
            console.log("Failed to update match", error);
        }
    };

    const deleteMatch = async () => {
        try {
            await fetch(`http://localhost:8080/api/matches/${match.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": createBearerAuthHeader(jwt),
                    "Content-Type": "application/json"
                }
            });

            setMatches([...matches.filter(curr => curr.id !== match.id)]);
        } catch (error) {
            console.log("Failed to delete match", error);
        }
    };

    const teamSelection = teams.map(team => ({
        value: team.id.toString(),
        label: team.name
    }));

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await updateMatch();
            }}>
                <Stack gap="md">
                    <MatchFormFields teams={teamSelection} matchFormFields={matchForm} />

                    <Group justify="space-between" mt="md">
                        <Button
                            color="red"
                            variant="outline"
                            onClick={async (e) => {
                                e.preventDefault();
                                await deleteMatch();
                            }}
                        >
                            Delete
                        </Button>

                        <Button type="submit">
                            Save Changes
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
};

export default UpdateMatchForm;
