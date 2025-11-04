import {Box, Title} from "@mantine/core";
import type {Match} from "../../types/match.ts";
import {useEffect, useState} from "react";
import {updateLiveTime} from "./live_time.ts";


interface LiveMatchClockViewProps {
    match: Match
}

const LiveMatchClockView = ({ match }: LiveMatchClockViewProps) => {
    const [timeLeft, setTimeLeft] = useState(match.clockTimestamp);
    useEffect(() => updateLiveTime(match, setTimeLeft), [match]);

    const seconds = String(timeLeft % 60).padStart(2, "0");

    return (
        <Box ta="center" mt="md">
            <Title c={match.timeRunning ? "green" : "gray"}>
                {`${Math.floor(timeLeft / 60)}:${seconds}`}
            </Title>
        </Box>
    );
};

export default LiveMatchClockView;
