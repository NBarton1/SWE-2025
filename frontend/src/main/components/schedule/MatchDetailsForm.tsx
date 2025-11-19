import React, {type Dispatch} from "react";
import { Button, Group, Stack, Paper } from "@mantine/core";
import {Match} from "../../types/match.ts";
import type { Team } from "../../types/team.ts";
import {useForm} from "@mantine/form";
import MatchFormFields from "./MatchFormFields.tsx";
import { updateMatch, deleteMatch, type UpdateMatchRequest } from "../../request/matches.ts";
import {useNavigate} from "react-router";
import {useAuth} from "../../hooks/useAuth.tsx";
import {isAdmin} from "../../types/accountTypes.ts";


interface UpdateMatchFormProps {
    match: Match
    teams: Team[]
    matches: Match[]
    setMatches: Dispatch<React.SetStateAction<Match[]>>
}

const MatchDetailsForm = ({ match, teams, matches, setMatches }: UpdateMatchFormProps) => {
    console.log("date", match.getDate());

    const navigate = useNavigate();

    const {currentAccount} = useAuth();

    const adminPrivilege = isAdmin(currentAccount);

    const matchForm = useForm({
        initialValues: {
            homeTeamId: match.getHomeTeamId().toString(),
            awayTeamId: match.getAwayTeamId().toString(),
            time: match.getTime(),
            date: match.getDate() as string | null,
            type: match.getType()
        },
    });

    const updateMatchCallback = async () => {
        try {
            const { type, homeTeamId, awayTeamId, time, date } = matchForm.values;

            const req: UpdateMatchRequest = {
                matchId: match.getId(),
                type,
                homeTeamId,
                awayTeamId,
                date: `${date}T${time}`,
            };

            const updatedMatch: Match = await updateMatch(req);

            setMatches(matches.map(curr_match => {
                return curr_match.getId() === updatedMatch.getId() ? updatedMatch : curr_match
            }));
        } catch (error) {
            console.log("Failed to update match", error);
        }
    };

    const deleteMatchCallback = async () => {
        try {
            await deleteMatch(match.getId());

            setMatches([...matches.filter(curr => curr.getId() !== match.getId())]);
        } catch (error) {
            console.log("Failed to delete match", error);
        }
    };

    const teamSelection = teams.map(team => ({
        value: team.id.toString(),
        label: team.name
    }));

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder data-testid={`update-match-form-${match.getId()}`}>
            <form onSubmit={async (e) => {
                e.preventDefault();
                await updateMatchCallback();
            }}>
                <Stack gap="md">
                    <MatchFormFields
                        teams={teamSelection}
                        matchFormFields={matchForm}
                        readOnly={!adminPrivilege}
                    />

                    {adminPrivilege &&
                        <Group justify="right" mt="md">
                            <Button
                                color="red"
                                variant="outline"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await deleteMatchCallback();
                                }}
                                data-testid="match-delete-button"
                            >
                                Delete
                            </Button>

                            <Button
                                onClick={() => navigate(`/match/${match.getId()}`)}
                            >
                                Edit Live Feed
                            </Button>

                            <Button type="submit">
                                Save Changes
                            </Button>
                        </Group>
                    }
                </Stack>
            </form>
        </Paper>
    );
};

export default MatchDetailsForm;
