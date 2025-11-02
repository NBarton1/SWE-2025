import {Container, Paper, Stack} from "@mantine/core";
import MatchClock from "./MatchClock.tsx";
import TeamScore from "./TeamScore.tsx";
import { useForm } from "@mantine/form";
import {useEffect, useRef} from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import type {Match} from "../../types/match.ts";
import type {UpdateMatchRequest} from "../../request/matches.ts";

interface LiveMatchEditProps {
    matchId: number,
}

const LiveMatchEdit = ({ matchId }: LiveMatchEditProps) => {
    const liveMatchForm = useForm({
        initialValues: {
            homeScore: 0,
            awayScore: 0,
            timeLeft: ""
        },
    });

    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            debug: (str) => console.log(str),
        });

        stompClient.onConnect = () => {
            stompClient.subscribe(`/app/match/1`, (message: IMessage) => {
                const match: Match = JSON.parse(message.body);
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('Broker error: ' + frame.headers['message']);
        };

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            stompClient.deactivate().then(() => console.log("Deactivated"));
        };
    }, []);

    const updateLiveMatchCallback = () => {
        const { homeScore, awayScore, timeLeft } = liveMatchForm.values;

        if (clientRef.current?.connected) {
            let req: UpdateMatchRequest = {
                homeScore,
                awayScore,
                timeLeft,
            }

            clientRef.current.publish({
                destination: "/app/match/live-update/1",
                body: JSON.stringify(req),
            });
        } else {
            console.error("Not Connected");
        }
    };

    return (
        <Container py="md">
            <Paper shadow="sm" p="md" radius="md" withBorder>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    updateLiveMatchCallback()
                }}>
                    <Stack gap="md">
                        <TeamScore />
                        <MatchClock />
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default LiveMatchEdit;
