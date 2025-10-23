import React, {type Dispatch, useState} from "react";
import {type Match, MatchType} from "./match.ts";
import type { Team } from "./team.ts";
import TimeInput from "./TimeInput.tsx";


interface MatchFormProps {
    type: Number
    setType: Dispatch<React.SetStateAction<Number>>
}


const MatchTypeSelect: React.FC = ({ type, setType } : MatchFormProps) => {
    return (
        <>
            <label htmlFor="matchType">Match Type:</label>
            <select id="matchType" defaultValue={type} onChange={(e) => {
                e.preventDefault();
                setType(Number(e.target.value))
            }}>
                {type == null && <option value="" selected disabled hidden>Select Match Type</option>}
                <option value={MatchType.Regular}>Regular</option>
                <option value={MatchType.Playoff}>Playoff</option>
            </select>
        </>
    );
};

export default MatchTypeSelect;
