import {getMatch, type UpdateMatchRequest} from "../../request/matches.ts";
import {Client, type IMessage} from "@stomp/stompjs";
import {Match, type MatchResponse} from "../../types/match.ts";
import type {RefObject} from "react";


export function createMatchWebsocket(
    matchId: number,
    setMatch: React.Dispatch<React.SetStateAction<Match|null>>,
    clientRef: React.RefObject<Client|null>
) {
    getMatch(matchId).then(setMatch);

    const stompClient = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        debug: (str) => console.log(str),
    });

    stompClient.onConnect = (_) => {

        stompClient.subscribe(`/topic/match/${matchId}`, (message: IMessage) => {
            const receivedMatch: MatchResponse = JSON.parse(message.body);
            console.log("Match: ", receivedMatch);

            setMatch(new Match(receivedMatch));
        });
    };

    stompClient.onStompError = (frame) => {
        console.error(frame.headers['message']);
    };

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
        stompClient.deactivate().then(() => console.log("Deactivated"));
    };
}

export function updateMatchCallback(
    matchId: number,
    clientRef: RefObject<Client | null>
) {
    return (
        req: UpdateMatchRequest
    ) => {

        const client = clientRef.current;

        if (client?.connected) {

            client.publish({
                destination: `/app/match/live-update/${matchId}`,
                body: JSON.stringify(req),
            });
        } else {
            console.error("Not Connected");
        }
    };
}


