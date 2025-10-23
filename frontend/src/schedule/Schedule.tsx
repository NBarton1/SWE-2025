import React, {useCallback, useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./Schedule.css"
import DatePopup from "./DatePopup.tsx";
import {type Match, matchStr, type Team} from './match.ts';
import 'reactjs-popup/dist/index.css';
import {token} from "../main.tsx";

const Schedule: React.FC = () => {
    let [matches, setMatches] = useState<Match[]>([]);
    let [teams, setTeams] = useState<Team[]>([]);
    let [date, setDate] = useState<string|null>(null);


    const dateClick = useCallback((date) => {
        setDate(date.dateStr);
    }, []);

    const getMatches = async () => {
        try {
            let matches_res: Response = await fetch("http://localhost:8080/api/match/all", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            return await matches_res.json();
        } catch (error) {
            console.log("Failed to get matches");
            return null;
        }
    };

    const getTeams = async () => {
        try {
            let teams_response = await fetch("http://localhost:8080/api/teams", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log(teams_response.status);

            return await teams_response.json();
        } catch (error) {
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
