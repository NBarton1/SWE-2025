import {getMatch} from "../../request/matches.ts";
import {Client, type IMessage} from "@stomp/stompjs";
import type {Match} from "../../types/match.ts";


export function live_match_websocket(
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
            const receivedMatch: Match = JSON.parse(message.body);
            console.log("Match: ", receivedMatch);

            setMatch(receivedMatch);
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
