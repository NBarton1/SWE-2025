import {Title, Stack, Group, Box, Container} from "@mantine/core";
import MatchView from "../match/MatchView.tsx";
import MatchDelete from "../match/MatchDelete.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import {isAdmin} from "../../types/accountTypes.ts";
import {Match} from "../../types/match.ts";
import React, {type Dispatch} from "react";


interface ScheduleListProps {
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
}

const ScheduleList = ({ matches, setMatches }: ScheduleListProps) => {

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
                            <MatchDelete match={match} matches={matches} setMatches={setMatches} />
                        }
                    </Group>
                ))}
            </Stack>
        </Container>
    );
};

export default ScheduleList;

