import React, {type Dispatch} from "react";
import {MatchType} from "./match.ts";


interface MatchFormProps {
    type: string
    setType: Dispatch<React.SetStateAction<string>>
}


const MatchTypeSelect: React.FC = ({ type, setType } : MatchFormProps) => {
    return (
        <>
            <label htmlFor="matchType">Match Type:</label>
            <select id="matchType" defaultValue={type} onChange={(e) => {
                e.preventDefault();
                setType(e.target.value)
            }}>
                {type == null && <option value="" selected disabled hidden>Select Match Type</option>}
                <option value={MatchType.STANDARD}>{MatchType.STANDARD}</option>
                <option value={MatchType.PLAYOFF}>{MatchType.PLAYOFF}</option>
            </select>
        </>
    );
};

export default MatchTypeSelect;
