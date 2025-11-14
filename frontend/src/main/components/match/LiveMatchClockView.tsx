import {Box, Title} from "@mantine/core";
import {Match, MatchState} from "../../types/match.ts";
import {useEffect, useState} from "react";
import {updateLiveTime} from "./MatchLiveTime.ts";


interface LiveMatchClockViewProps {
    match: Match
}

const LiveMatchClockView = ({ match }: LiveMatchClockViewProps) => {

    if (match.matchRes.state != MatchState.LIVE) {
        return null;
    }

    const [timeLeft, setTimeLeft] = useState(match.matchRes.clockTimestamp);
    useEffect(() => updateLiveTime(match.matchRes, setTimeLeft), [match]);

    const seconds = String(timeLeft % 60).padStart(2, "0");

    return (
        <Box
            ta="center"
            mt="md"
            data-testid="live-match-clock-view"
        >
            <Title
                data-testid="live-match-time-remaining"
                c={match.matchRes.timeRunning ? "green" : "gray"}
            >
                {`${Math.floor(timeLeft / 60)}:${seconds}`}
            </Title>
        </Box>
    );
};

export default LiveMatchClockView;
