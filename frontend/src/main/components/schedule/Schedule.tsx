import { useEffect, useState } from "react";
import {Match} from "../../types/match.ts";
import type {Team} from "../../types/team.ts";
import {useToggle} from "react-use";
import {getMatches} from "../../request/matches.ts";
import {getTeams} from "../../request/teams.ts";
import ScheduleList from "./ScheduleList.tsx";
import Calendar from "./Calendar.tsx";
import {Button, Group, Modal, Paper, Stack, Title} from "@mantine/core";
import CreateMatchForm from "./CreateMatchForm.tsx";
import { useSearchParams } from 'react-router-dom';
import schedule from "./Schedule.tsx";
import ScheduleExcelImporter from "./ScheduleExcelDropzone.tsx";
import {isAdmin} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";


const Schedule = () => {

    const { currentAccount } = useAuth();

    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const [onListView, setOnListView] = useToggle(searchParams.get('view') === "list");

    useEffect(() => {
        const view = searchParams.get("view");
        if (view === "calendar") setOnListView(false);
        else if (view === "list") setOnListView(true);
    }, [searchParams]);

    const [newMatchModalOpened, setNewMatchModalOpened] = useState(false);

    const [scheduleImportModalOpened, setScheduleImportModalOpened] = useState(false);

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
                    onClick={() => setNewMatchModalOpened(true)}
                    data-testid="new-match-button"
                >
                    New Match
                </Button>

                <Button
                    onClick={() => {
                        setSearchParams({ view: onListView ? "calendar" : "list" });
                        setOnListView(!onListView);
                    }}
                    data-testid="view-toggle-button"
                >
                    {onListView ? "Calendar View" : "List View"}
                </Button>

                {isAdmin(currentAccount) && <Button
                    onClick={() => setScheduleImportModalOpened(true)}
                >
                    Import Schedule from Excel
                </Button>
                }

            </Group>

            {onListView ? (
                <ScheduleList
                    matches={matches}
                    setMatches={setMatches}
                    teams={teams}
                />
            ) : (
                <Calendar
                    teams={teams}
                    matches={matches}
                    setMatches={setMatches}
                />
            )}

            <Modal
                opened={newMatchModalOpened}
                onClose={() => setNewMatchModalOpened(false)}
                size="lg"
                data-testid="event-popup"
            >
                <Title
                    order={2}
                    mb="md"
                    ta="center"
                >
                    New Match
                </Title>

                    <CreateMatchForm
                        teams={teams}
                        matches={matches}
                        setMatches={setMatches}
                        date={null}
                    />

            </Modal>

            <Modal
                opened={scheduleImportModalOpened}
                onClose={() => setScheduleImportModalOpened(false)}
                size="lg"
                data-testid="schedule-import-popup"
            >
                <Title
                    order={2}
                    mb="md"
                    ta="center"
                >
                    Import Schedule from Excel
                </Title>

                <ScheduleExcelImporter></ScheduleExcelImporter>

            </Modal>
        </Paper>
    );
};

export default Schedule;
