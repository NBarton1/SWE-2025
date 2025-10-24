import React, {type Dispatch} from "react";


interface MatchFormProps {
    time: string
    setTime: Dispatch<React.SetStateAction<string>>
}

const TimeInput = ({ time, setTime } : MatchFormProps) => {
    return (
        <>
            <label htmlFor="time">Time:</label>
            <input id="time" value={time} onChange={(e) => {
                e.preventDefault();
                setTime(e.target.value);
            }}/>
        </>
    );
};

export default TimeInput;
