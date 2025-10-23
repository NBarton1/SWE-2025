import React, {type Dispatch, useState} from "react";
import {type Match, MatchType} from "./match.ts";
import type { Team } from "./team.ts";
import TimeInput from "./TimeInput.tsx";
import MatchTypeSelect from "./MatchTypeSelect.tsx";


interface MatchFormProps {
    initialMatch: Match
    teams: Team[]
    date: string
    matches: Match[]
    setMatches: Dispatch<React.SetStateAction<Match[]>>
}


const CreateMatchForm: React.FC = ({ teams, date, matches, setMatches } : MatchFormProps) => {
    const [homeTeamId, setHomeTeamId] = useState(0);
    const [awayTeamId, setAwayTeamId] = useState(0);
    const [time, setTime] = useState("");
    const [type, setType] = useState(0);

    const createMatch = async () => {
        try {
            let res = await fetch("http://localhost:8080/api/match/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: type,
                    homeTeamId: homeTeamId,
                    awayTeamId: awayTeamId,
                    date: `${date}T${time}`,
                })
            });

            let createdMatch = await res.json();

            matches.push(createdMatch);
            setMatches([...matches]);
        } catch (error) {
            console.log("Failed to create match", error);
        }
    };

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            await createMatch();
        }}>
            <label htmlFor="home">Home Team:</label>
            <select id="home" onChange={(e) => {
                setHomeTeamId(Number(e.target.value));
            }}>
                <option value="" selected disabled hidden>Select Home Team</option>
                {teams.map(team => <option value={team.id}>{team.name}</option>)}
            </select>

            <label htmlFor="away">Away Team:</label>
            <select id="away" onChange={(e) => {
                setAwayTeamId(Number(e.target.value));
            }}>
                <option value="" selected disabled hidden>Select Away Team</option>
                {teams.map(team => <option value={team.id}>{team.name}</option>)}
            </select>

            <TimeInput time={time} setTime={setTime} />

            <MatchTypeSelect setType={setType} />

            <button type="submit">Save</button>
        </form>
    );
};

export default CreateMatchForm;
