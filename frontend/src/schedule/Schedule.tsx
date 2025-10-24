import { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Container, Paper, Modal, Title, Box } from "@mantine/core";
import DatePopup from "./DatePopup.tsx";
import { type Match, matchStr } from "./match.ts";
import type { Team } from "./team.ts";
import { createBearerAuthHeader } from "../util.ts";
import { getTeams } from "../request/teams.ts";


interface ScheduleProps {
    jwt: string;
}

const Schedule = ({ jwt }: ScheduleProps) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [opened, setOpened] = useState(false);

    const dateClick = useCallback((info: { dateStr: string }) => {
        setSelectedDate(info.dateStr);
        setOpened(true);
    }, []);

    const getMatches = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/api/matches", {
                method: "GET",
                headers: { Authorization: createBearerAuthHeader(jwt) },
            });
            return await res.json();
        } catch (err) {
            console.error("Failed to get matches", err);
            return [];
        }
    }, [jwt]);

    useEffect(() => {
        getMatches().then(setMatches);
        getTeams(jwt).then(setTeams);
    }, [getMatches, jwt]);

    return (
        <Container py="md">
            <Paper shadow="md" p="md" radius="md">
                <Title order={2} mb="md" ta="center">
                    Schedule
                </Title>

                <Box>
                    <style>
                        {`
                            .fc .fc-col-header-cell-cushion {
                                color: black !important;
                            }
                        `}
                    </style>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        dateClick={dateClick}
                        events={matches.map((match) => ({
                            title: matchStr(match),
                            start: match.date,
                        }))}
                        height="auto"
                    />
                </Box>
            </Paper>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                size="lg"
            >
                {selectedDate && (
                    <DatePopup
                        date={selectedDate}
                        matches={matches}
                        setMatches={setMatches}
                        teams={teams}
                        jwt={jwt}
                    />
                )}
            </Modal>
        </Container>
    );
};

export default Schedule;
