import React, {useState} from "react";
import MatchForm from "./MatchForm.tsx";


interface DateFormProps {
    formOpen: boolean,
}


const DateForm: React.FC = ({ formOpen }: DateFormProps) => {
    let [matches, setMatches] = useState([]);

    if (!formOpen) {
        return null;
    }

    const deleteMatch = async () => {
        try {
            await fetch("http://localhost:8080/api/match/delete", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({})
            });
        } catch (error) {
            console.log("Failed to delete match");
        }
    };

    return (
        <div>
            {matches.map((match) => (
                <div>
                    <label>{match}</label>
                    <button onClick={() => deleteMatch()}>Delete</button>
                </div>
            ))}
            <MatchForm teams={["DK"]}/>
        </div>
    );
};

export default DateForm;
