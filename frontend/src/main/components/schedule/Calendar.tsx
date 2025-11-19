import React, {type Dispatch, useCallback, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {Modal, Title, Box} from "@mantine/core";
import DatePopup from "./DatePopup.tsx";
import {Match} from "../../types/match.ts";
import type {Team} from "../../types/team.ts";
import MatchDetailsModalFields from "./MatchDetailsModalFields.tsx";


interface CalendarProps {
    teams: Team[];
    matches: Match[];
    setMatches: Dispatch<React.SetStateAction<Match[]>>;
}

const Calendar = ({ teams, matches, setMatches }: CalendarProps) => {

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const dateClick = useCallback((info: { dateStr: string }) => {
        setSelectedDate(info.dateStr);
    }, []);

    const eventClick = useCallback((info: any) => {
        setSelectedMatch(info.event.extendedProps.match);
    }, []);

    return (
        <>
            <Title
                order={2}
                mb="md"
                ta="center"
                data-testid="schedule-title"
            >
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
                        title: match.getTitle(),
                        start: match.getDateTime(),
                        extendedProps: {
                            match
                        }
                    }))}
                    height="auto"
                    data-testid="calendar"
                />
            </Box>

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
                <MatchDetailsModalFields
                    match={selectedMatch}
                    setSelectedMatch={setSelectedMatch}
                    setMatches={setMatches}
                    teams={teams}
                />
            </Modal>
        </>
    );
};

export default Calendar;
