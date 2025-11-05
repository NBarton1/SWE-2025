import {Button, Group, NumberInput, rem, Text} from "@mantine/core";
import type {Match} from "../../types/match.ts";
import {useEffect, useState} from "react";
import type {UpdateMatchRequest} from "../../request/matches.ts";
import {updateLiveTime} from "./live_time.ts";


interface MatchClockProps {
    match: Match
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

const LiveMatchClockEdit = ({ match, updateLiveMatch }: MatchClockProps) => {
    const [timeLeft, setTimeLeft] = useState(match.clockTimestamp);
    const [editingTime, setEditingTime] = useState(false);

    useEffect(() => updateLiveTime(match, setTimeLeft), [match]);

    const updateMinutes = (minutes: string|number) => {
        if (minutes == "") return;

        const prevMinutes = Math.floor(timeLeft / 60);
        setTimeLeft(timeLeft + (minutes as number - prevMinutes) * 60);
    };

    const updateSeconds = (seconds: string|number) => {
        if (seconds == "") return;

        const prevSeconds = timeLeft % 60;
        setTimeLeft(timeLeft + (seconds as number - prevSeconds));
    };

    return (
            <Group align="center" wrap="nowrap">
                <Text style={{ width: rem(150), flexShrink: 0 }} fw={700}>
                    Time
                </Text>

                <NumberInput
                    readOnly={!editingTime}
                    value={Math.floor(timeLeft / 60)}
                    onChange={(value) => updateMinutes(value)}
                    style={{ width: rem(80) }}
                />
                <Text size="xl" pb="xs">:</Text>
                <NumberInput
                    readOnly={!editingTime}
                    value={timeLeft % 60}
                    onChange={(value) => updateSeconds(value)}
                    style={{ width: rem(80) }}
                />
                {editingTime ? (
                    <Button onClick={() => {
                        setEditingTime(false);
                        updateLiveMatch({ timeLeft });
                    }}>Confirm</Button>
                ) : (
                    <>
                        <Button disabled={timeLeft == 0} onClick={() => updateLiveMatch({toggleClock: true})}>
                            {match.timeRunning ? "Pause" : "Start"}
                        </Button>
                        <Button onClick={() => setEditingTime(true)}>Set</Button>
                    </>
                )}
            </Group>
    );
};

export default LiveMatchClockEdit;
