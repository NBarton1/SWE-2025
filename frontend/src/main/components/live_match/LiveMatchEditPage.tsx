import {Container} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import type {Match} from "../../types/match.ts";
import LiveMatchEdit from "./LiveMatchEdit.tsx";
import {getMatch, type UpdateMatchRequest} from "../../request/matches.ts";

interface LiveMatchEditProps {
    matchId: number,
}

const LiveMatchEditPage = ({ matchId }: LiveMatchEditProps) => {
    const [match, setMatch] = useState<Match | null>(null);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        getMatch(matchId).then(setMatch);

        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            debug: (str) => console.log(str),
        });

        stompClient.onConnect = () => {

            stompClient.subscribe(`/topic/match/${matchId}`, (message: IMessage) => {
                const receivedMatch: Match = JSON.parse(message.body);
                console.log("Match: ", receivedMatch);

                setMatch(receivedMatch);
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

    const updateLiveMatch = (req: UpdateMatchRequest) => {

        if (clientRef.current?.connected) {

            clientRef.current.publish({
                destination: `/app/match/live-update/${matchId}`,
                body: JSON.stringify(req),
            });
        } else {
            console.error("Not Connected");
        }
    };

    return (
        <Container py="md">
            {match && <LiveMatchEdit match={match} updateLiveMatch={updateLiveMatch} />}
        </Container>
    );
};

export default LiveMatchEditPage;
