import React, {type Dispatch, useEffect, useState} from "react";
import {type Match, matchTime} from "./match.ts";
import type { Team } from "./team.ts";
import TimeInput from "./TimeInput.tsx";
import MatchTypeSelect from "./MatchTypeSelect.tsx";
import {token} from "../main.tsx";


interface MatchFormProps {
    match: Match
    teams: Team[]
    date: string
    matches: Match[]
    setMatches: Dispatch<React.SetStateAction<Match[]>>
}

const UpdateMatchForm: React.FC = ({ match, teams, date, matches, setMatches } : MatchFormProps) => {

    const [homeTeamId, setHomeTeamId] = useState(match.homeTeam.id);
    const [awayTeamId, setAwayTeamId] = useState(match.awayTeam.id);
    const [time, setTime] = useState(matchTime(match));
    const [type, setType] = useState(match.type);

    useEffect(() => {
        setHomeTeamId(match.homeTeam.id);
        setAwayTeamId(match.awayTeam.id);
        setTime(matchTime(match));
        setType(match.type);
    }, [match]);

    const updateMatch = async () => {
        try {
            let res = await fetch("http://localhost:8080/api/match/update", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: match.id,
                    type: type,
                    homeTeamId: homeTeamId,
                    awayTeamId: awayTeamId,
                    date: `${date}T${time}`
                })
            });

            let updatedMatch: Match = await res.json();

            setMatches(matches.map(curr_match => curr_match.id == updatedMatch.id ? updatedMatch : curr_match));
        } catch (error) {
            console.log("Failed to update match", error);
        }
    };

    const deleteMatch = async () => {
        try {
            await fetch("http://localhost:8080/api/match/delete", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: match.id
                })
            });

            setMatches([...matches.filter(curr => curr.id != match.id)]);
        } catch (error) {
            console.log("Failed to delete match", error);
        }
    };

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            await updateMatch();
        }}>
            <label htmlFor="home">Home Team:</label>
            <select id="home" defaultValue={homeTeamId} onChange={(e) => {
                setHomeTeamId(Number(e.target.value));
            }}>
                {teams.map(team => <option value={team.id}>{team.name}</option>)}
            </select>

            <label htmlFor="away">Away Team:</label>
            <select id="away" defaultValue={awayTeamId} onChange={(e) => {
                setAwayTeamId(Number(e.target.value));
            }}>
                {teams.map(team => <option value={team.id}>{team.name}</option>)}
            </select>

            <TimeInput time={time} setTime={setTime} />

            <MatchTypeSelect type={type} setType={setType} />

            <button type="submit">Save</button>

            <button onClick={async (e) => {
                e.preventDefault();
                await deleteMatch();
            }}>Delete</button>
        </form>
    );
};

export default UpdateMatchForm;
