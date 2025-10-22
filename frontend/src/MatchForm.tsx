import React, {useState} from "react";


interface MatchFormProps {
    teams: string[],
}

const MatchForm: React.FC = ({ teams } : MatchFormProps) => {
    const [homeTeam, setHomeTeam] = useState('');
    const [awayTeam, setAwayTeam] = useState('');
    const [time, setTime] = useState('');

    const createMatch = async (e) => {
        e.preventDefault();

        try {
            await fetch("http://localhost:8080/api/match/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    homeTeam,
                    awayTeam,
                    time,
                })
            });
        } catch (error) {
            console.log("Failed to create match");
        }
    };

    return (
        <form onSubmit={createMatch}>
            <label htmlFor="home">Home Team:</label>
            <select id="home" onChange={(e) => setHomeTeam(e.target.value)}>
                {teams.map(team => <option value={team}>{team}</option>)}
            </select>

            <label htmlFor="away">Away Team:</label>
            <select id="away" onChange={(e) => setAwayTeam(e.target.value)}>
                {teams.map(team => <option value={team}>{team}</option>)}
            </select>

            <input id="time" onChange={(e) => setTime(e.target.value)}/>

            <button type="submit">Submit</button>
        </form>
    );
};

export default MatchForm;
