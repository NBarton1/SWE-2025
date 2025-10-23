import React, {type Dispatch} from "react";
import UpdateMatchForm from "./UpdateMatchForm.tsx";
import {type Match, matchDate} from "./match.ts";
import type {Team} from "./team.ts";
import CreateMatchForm from "./CreateMatchForm.tsx";


interface DateFormProps {
    date: string | null
    matches: Match[]
    setMatches: Dispatch<React.SetStateAction<Match[]>>
    teams: Team[]
}


const DatePopup = ({ date, matches, setMatches, teams }: DateFormProps) => {

    if (date == null) {
        return null;
    }

    return (
        <div>
            <h2>Matches On {date}:</h2>
            {matches.filter(match => matchDate(match) == date).map(match => (
                <UpdateMatchForm match={match} teams={teams} date={date} matches={matches} setMatches={setMatches}/>
            ))}
            <CreateMatchForm date={date} teams={teams} matches={matches} setMatches={setMatches} />
        </div>
    );
};

export default DatePopup;
