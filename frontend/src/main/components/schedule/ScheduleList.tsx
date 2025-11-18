import {Title, Stack, Group, Box, Container, Modal} from "@mantine/core";
import MatchView from "../match/MatchView.tsx";
import MatchUpdateIcons from "./MatchUpdateIcons.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {isAdmin} from "../../types/accountTypes.ts";
import {Match} from "../../types/match.ts";
import React, {type Dispatch, useState} from "react";
import MatchDetailsModalFields from "./MatchDetailsModalFields.tsx";
import type {Team} from "../../types/team.ts";


interface ScheduleListProps {
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
    teams: Team[]
}

const ScheduleList = ({ matches, setMatches, teams }: ScheduleListProps) => {

    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const {currentAccount} = useAuth();

    return (
        <Container>
            <Title
                order={2} mb="md"
                ta="center"
                data-testid="schedule-list-title"
            >
                Schedule
            </Title>

            <Stack
                gap="md"
            >
                {matches.sort((m0, m1) => m1.cmp(m0)).map((match) => (
                    <Group
                        justify="space-between"
                        align="flex-start"
                        wrap="nowrap"
                    >
                        <Box
                            style={{ flex: 1 }}
                        >
                            <MatchView match={match} navigable={true} />
                        </Box>

                        {isAdmin(currentAccount) &&
                            <MatchUpdateIcons match={match} setMatch={setSelectedMatch} matches={matches} setMatches={setMatches} />
                        }
                    </Group>
                ))}
            </Stack>

            <Modal
                opened={selectedMatch != null}
                onClose={() => setSelectedMatch(null)}
                size="lg"
                data-testid="event-popup"
            >
                <MatchDetailsModalFields
                    match={selectedMatch}
                    matches={matches}
                    setMatches={setMatches}
                    teams={teams}
                />
            </Modal>
        </Container>
    );
};

export default ScheduleList;

