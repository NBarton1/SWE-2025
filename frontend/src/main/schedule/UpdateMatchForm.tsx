import React, {type Dispatch} from "react";
import { Button, Group, Stack, Paper } from "@mantine/core";
import { type Match, matchTime } from "./match.ts";
import type { Team } from "./team.ts";
import {useForm} from "@mantine/form";
import MatchFormFields from "./MatchFormFields.tsx";
import { updateMatch, deleteMatch } from "../request/matches.ts";


interface UpdateMatchFormProps {
    match: Match;
    teams: Team[];
    date: string;
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
}

const UpdateMatchForm = ({ match, teams, date, matches, setMatches }: UpdateMatchFormProps) => {

    const matchForm = useForm({
        initialValues: {
            homeTeamId: `${match.homeTeam.id}`,
            awayTeamId: `${match.awayTeam.id}`,
            time: matchTime(match),
            type: match.type
        },
    });

    const updateMatchCallback = async () => {
        try {
            const { type, homeTeamId, awayTeamId, time } = matchForm.values;

            const updatedMatch: Match = await updateMatch(match.id, type, homeTeamId, awayTeamId, time, date);

            setMatches(matches.map(curr_match => curr_match.id === updatedMatch.id ? updatedMatch : curr_match));
        } catch (error) {
            console.log("Failed to update match", error);
        }
    };

    const deleteMatchCallback = async () => {
        try {
            await deleteMatch(match.id);

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
        <Paper shadow="sm" p="md" radius="md" withBorder data-testid={`update-match-form-${match.id}`}>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await updateMatchCallback();
            }}>
                <Stack gap="md">
                    <MatchFormFields teams={teamSelection} matchFormFields={matchForm} />

                    <Group justify="space-between" mt="md">
                        <Button
                            color="red"
                            variant="outline"
                            onClick={async (e) => {
                                e.preventDefault();
                                await deleteMatchCallback();
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
