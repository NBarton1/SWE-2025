import React, {useCallback, useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import "./Schedule.css"


const Schedule: React.FC = () => {
    let [matches, setMatches] = useState([]);
    let [formOpen, setFormOpen] = useState(false);

    const dateClick = useCallback((date) => {
        setFormOpen(true);
    }, []);

    useEffect(() => {
        const getMatches = async () => {
            try {
                let res = await fetch("http://localhost:8080/api/match/all", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({})
                });

                return await res.json();
            } catch (error) {
                console.log("Failed to get matches");
                return null;
            }
        };

        getMatches().then(matches => {
            console.log(matches);
            setMatches(matches);
        });
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
            />
            <DateForm formOpen={formOpen}/>
        </>
    );
};

export default Schedule;
