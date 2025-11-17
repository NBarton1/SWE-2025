import React, { type Dispatch } from "react";
import {Stack, Title, Text} from "@mantine/core";
import MatchDetailsForm from "./MatchDetailsForm.tsx";
import {Match} from "../../types/match.ts";
import type { Team } from "../../types/team.ts";
import CreateMatchForm from "./CreateMatchForm.tsx";
import {isAdmin} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";

interface DatePopupProps {
    date: string | null;
    matches: Match[];
    teams: Team[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
    setSelectedMatch: Dispatch<React.SetStateAction<Match | null>>
}

const DatePopup = ({ date, matches, teams, setMatches, setSelectedMatch }: DatePopupProps) => {

    if (date == null) {
        return null;
    }

    const {currentAccount} = useAuth();

    const adminPrivilege = isAdmin(currentAccount);

    const dateMatches = matches.filter(match => match.getDate() === date);

    return (
        <Stack gap="lg" data-testid="date-popup-stack">
            <Title order={3}>
                {new Date(`${date}T00:00`).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </Title>

            {adminPrivilege &&
                <div>
                    <Text size="sm" fw={500} c="dimmed" mb="md">Create New Match</Text>
                    <CreateMatchForm
                        date={date}
                        teams={teams}
                        matches={matches}
                        setMatches={setMatches}
                    />
                </div>
            }

            {dateMatches.length > 0 && (
                <>
                    <Text size="sm" fw={500} c="dimmed">Scheduled Matches</Text>

                    <Stack gap="md">
                        {dateMatches.sort((m0, m1) => m0.cmp(m1)).map(match => (
                            <MatchDetailsForm
                                match={match}
                                teams={teams}
                                matches={matches}
                                setMatches={setMatches}
                                setSelectedMatch={setSelectedMatch}
                            />
                        ))}
                    </Stack>
                </>
            )}
        </Stack>
    );
};

export default DatePopup;
