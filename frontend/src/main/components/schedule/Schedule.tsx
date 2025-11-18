import { useEffect, useState } from "react";
import {Match} from "../../types/match.ts";
import type {Team} from "../../types/team.ts";
import {useToggle} from "react-use";
import {getMatches} from "../../request/matches.ts";
import {getTeams} from "../../request/teams.ts";
import ScheduleList from "./ScheduleList.tsx";
import Calendar from "./Calendar.tsx";
import {Button, Group, Paper} from "@mantine/core";


const Schedule = () => {

    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    const [onListView, toggleView] = useToggle(false);

    // const [newMatchModalOpened, setNewMatchModalOpened] = useState(false);

    useEffect(() => {
        getMatches().then(setMatches);
        getTeams().then(setTeams);
    }, []);

    return matches && (
        <Paper
            shadow="md"
            p="md"
            radius="md"
            data-testid="schedule-paper"
        >
            <Group>
                <Button
                    onClick={toggleView}
                >
                    {onListView ? "Calendar View" : "List View"}
                </Button>

                {/*<Button*/}
                {/*    onClick={() => setNewMatchModalOpened(true)}*/}
                {/*>*/}
                {/*    New Match*/}
                {/*</Button>*/}
            </Group>

            {onListView ? (
                <ScheduleList
                    matches={matches}
                    setMatches={setMatches}
                />
            ) : (
                <Calendar
                    teams={teams}
                    matches={matches}
                    setMatches={setMatches}
                />
            )}

            {/*<Modal*/}
            {/*    opened={newMatchModalOpened}*/}
            {/*    onClose={() => setNewMatchModalOpened(false)}*/}
            {/*    size="lg"*/}
            {/*    data-testid="event-popup"*/}
            {/*>*/}
            {/*    <Title*/}
            {/*        order={2}*/}
            {/*        mb="md"*/}
            {/*        ta="center"*/}
            {/*    >*/}
            {/*        New Match*/}
            {/*    </Title>*/}

            {/*    <CreateMatchForm*/}
            {/*        teams={teams}*/}
            {/*        matches={matches}*/}
            {/*        setMatches={setMatches}*/}
            {/*        date={null}*/}
            {/*    />*/}
            {/*</Modal>*/}
        </Paper>
    );
};

export default Schedule;
