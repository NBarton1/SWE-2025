import React, { type Dispatch } from "react";
import { Button, Group, Stack, Paper } from "@mantine/core";
import {type Match} from "./match.ts";
import type { Team } from "./team.ts";
import { createBearerAuthHeader } from "../util.ts";
import {useForm} from "@mantine/form";
import MatchFormFields from "./MatchFormFields.tsx";

interface CreateMatchFormProps {
    teams: Team[];
    date: string;
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
    jwt: string;
}

const CreateMatchForm = ({ teams, date, matches, setMatches, jwt }: CreateMatchFormProps) => {

    const matchForm = useForm({
        initialValues: {
            homeTeamId: "",
            awayTeamId: "",
            time: "",
            type: ""
        },
    });

    const createMatch = async () => {
        try {
            const { type, homeTeamId, awayTeamId, time } = matchForm.values;

            const res = await fetch("http://localhost:8080/api/matches", {
                method: "POST",
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

            const createdMatch = await res.json();

            matches.push(createdMatch);
            setMatches([...matches]);
        } catch (error) {
            console.log("Failed to create match", error);
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
                await createMatch();
            }}>
                <Stack gap="md">
                    <MatchFormFields teams={teamSelection} matchFormFields={matchForm} />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit" >
                            Create Match
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
};

export default CreateMatchForm;
