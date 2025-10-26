import React, {type Dispatch} from "react";
import { Button, Group, Stack, Paper } from "@mantine/core";
import {type Match} from "./match.ts";
import type { Team } from "./team.ts";
import {useForm} from "@mantine/form";
import MatchFormFields from "./MatchFormFields.tsx";
import {createMatch} from "../request/matches.ts";

interface CreateMatchFormProps {
    teams: Team[];
    date: string;
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
}

const CreateMatchForm = ({ teams, date, matches, setMatches }: CreateMatchFormProps) => {

    const matchForm = useForm({
        initialValues: {
            homeTeamId: "",
            awayTeamId: "",
            time: "",
            type: ""
        },
    });

    const createMatchCallback = async () => {
        try {
            const { type, homeTeamId, awayTeamId, time } = matchForm.values;

            let createdMatch: Match = await createMatch(type, homeTeamId, awayTeamId, time, date);

            console.log(createdMatch);

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
        <Paper shadow="sm" p="md" radius="md" withBorder data-testid="create-match-form">
            <form onSubmit={async (e) => {
                e.preventDefault();
                await createMatchCallback();
            }}>
                <Stack gap="md">
                    <MatchFormFields teams={teamSelection} matchFormFields={matchForm} />

                    <Group justify="flex-end" mt="md">
                        <Button type="submit" data-testid={`create-match-form-submit`}>
                            Create Match
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
};

export default CreateMatchForm;
