import React, { type Dispatch } from "react";
import { Stack, Title, Divider, Text } from "@mantine/core";
import UpdateMatchForm from "./UpdateMatchForm.tsx";
import { type Match, matchDate } from "./match.ts";
import type { Team } from "./team.ts";
import CreateMatchForm from "./CreateMatchForm.tsx";

interface DatePopupProps {
    date: string | null;
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
    teams: Team[];
    jwt: string;
}

const DatePopup = ({ date, matches, setMatches, teams, jwt }: DatePopupProps) => {

    if (date == null) {
        return null;
    }

    const dateMatches = matches.filter(match => matchDate(match) === date);

    return (
        <Stack gap="lg">
            <Title order={3}>
                {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </Title>

            <div>
                <Text size="sm" fw={500} c="dimmed" mb="md">Create New Match</Text>
                <CreateMatchForm
                    date={date}
                    teams={teams}
                    matches={matches}
                    setMatches={setMatches}
                    jwt={jwt}
                />
            </div>

            {dateMatches.length > 0 && (
                <>
                    <Text size="sm" fw={500} c="dimmed">Scheduled Matches</Text>
                    <Stack gap="md">
                        {dateMatches.map(match => (
                            <UpdateMatchForm
                                key={match.id}
                                match={match}
                                teams={teams}
                                date={date}
                                matches={matches}
                                setMatches={setMatches}
                                jwt={jwt}
                            />
                        ))}
                    </Stack>
                    <Divider my="sm"/>
                </>
            )}
        </Stack>
    );
};

export default DatePopup;
