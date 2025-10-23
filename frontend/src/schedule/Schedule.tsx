import React, {useCallback, useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./Schedule.css"
import DatePopup from "./DatePopup.tsx";
import {type Match, matchStr} from './match.ts';
import {authHeader} from "../main.tsx";
import type {Team} from "./team.ts";

const Schedule: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [date, setDate] = useState<string|null>(null);


    const dateClick = useCallback((date: { dateStr: string } ) => {
        setDate(date.dateStr);
    }, []);

    const getMatches = async () => {
        try {
            const matches_res: Response = await fetch("http://localhost:8080/api/matches", {
                method: "GET",
                headers: {
                    "Authorization": authHeader
                }
            });

            return await matches_res.json();
        } catch {
            console.log("Failed to get matches");
            return null;
        }
    };

    const getTeams = async () => {
        try {
            const teams_response = await fetch("http://localhost:8080/api/teams", {
                method: "GET",
                headers: {
                    "Authorization": authHeader
                }
            });

            console.log(teams_response.status);

            return await teams_response.json();
        } catch {
            console.log("Failed to get teams");
            return null;
        }
    };

    useEffect(() => {
        // TODO: error checking
        getMatches().then(matches => {
            console.log(matches);
            setMatches(matches);
        });

        getTeams().then(teams => {
            console.log(teams);
            setTeams(teams);
        })
    }, []);

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'title',
                    center: 'prev,next today',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                dateClick={dateClick}
                events={[...matches.map((match) => Object({"title": matchStr(match), "start": match.date}))]}
            />
            <DatePopup date={date} matches={matches} setMatches={setMatches} teams={teams}/>
        </>
    );
};

export default Schedule;
