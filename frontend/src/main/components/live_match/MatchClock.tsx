import {Button, Group, TextInput} from "@mantine/core";
import type {Match} from "../../types/match.ts";
import {useEffect, useState} from "react";
import type {UpdateMatchRequest} from "../../request/matches.ts";


interface MatchClockProps {
    match: Match
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

const MatchClock = ({ match, updateLiveMatch }: MatchClockProps) => {
    let [timeLeft, setTimeLeft] = useState(match.clockTimestamp)

    useEffect(() => {
        if (!match.timeRunning) return;

        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTime - 1
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [match.timeRunning]);

    return (
        <Group justify="center" mt="md">
            <TextInput readOnly value={timeLeft} />
            <Button disabled={timeLeft == 0} onClick={() => updateLiveMatch({ toggleClock: true })}>
                {match.timeRunning ? "Stop Clock" : "Start Clock"}
            </Button>
        </Group>
    );
};

export default MatchClock;
