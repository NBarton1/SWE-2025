import { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {Container, Paper, Modal, Title, Box, Button} from "@mantine/core";
import DatePopup from "./DatePopup.tsx";
import {Match} from "../../types/match.ts";
import type { Team } from "../../types/team.ts";
import { getTeams } from "../../request/teams.ts";
import {getMatches} from "../../request/matches.ts";
import MatchDetailsForm from "./MatchDetailsForm.tsx";


const Schedule = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    useEffect(() => {
        getMatches().then(setMatches);
        getTeams().then(setTeams);
    }, []);

    const dateClick = useCallback((info: { dateStr: string }) => {
        setSelectedDate(info.dateStr);
    }, []);

    const eventClick = useCallback((info: any) => {
        setSelectedMatch(info.event.extendedProps.match);
    }, []);

    return (
        <Container py="md">
            <Paper shadow="md" p="md" radius="md" data-testid="schedule-paper">

                <Button component="a" href="/calendar/list">
                    List View
                </Button>

                <Title order={2} mb="md" ta="center" data-testid="schedule-title">
                    Schedule
                </Title>

                <Box>
                    <style>
                        {`
                            .fc .fc-col-header-cell-cushion {
                                color: black !important;
                            }
                            
                            .fc-daygrid-event {
                              white-space: normal !important;
                              align-items: normal !important;
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
                        eventClick={eventClick}
                        events={matches.map((match) => ({
                            title: match.getTeams(),
                            start: match.getDateTime(),
                            extendedProps: {
                                match
                            }
                        }))}
                        height="auto"
                        data-testid="calendar"
                    />

                </Box>
            </Paper>

            <Modal
                opened={selectedDate != null}
                onClose={() => setSelectedDate(null)}
                size="lg"
                data-testid="date-popup"
            >
                {selectedDate && (
                    <DatePopup
                        date={selectedDate}
                        matches={matches}
                        teams={teams}
                        setMatches={setMatches}
                        setSelectedMatch={setSelectedMatch}
                    />
                )}
            </Modal>

            <Modal
                opened={selectedMatch != null}
                onClose={() => setSelectedMatch(null)}
                size="lg"
                data-testid="event-popup"
            >
                {selectedMatch && (
                    <MatchDetailsForm
                        match={selectedMatch}
                        teams={teams}
                        matches={matches}
                        setMatches={setMatches}
                        setSelectedMatch={setSelectedMatch}
                    />
                )}
            </Modal>
        </Container>
    );
};

export default Schedule;
