import {Container} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import { Client } from "@stomp/stompjs";
import {Match} from "../../types/match.ts";
import MatchEdit from "./MatchEdit.tsx";
import {type UpdateMatchRequest} from "../../request/matches.ts";
import {live_match_websocket} from "./MatchWebSocket.ts";
import {useParams} from "react-router";


const MatchEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const matchId = Number(id);

    const [match, setMatch] = useState<Match | null>(null);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => live_match_websocket(matchId, setMatch, clientRef), []);

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
        <Container
            py="md"
            data-testid="live-match-edit-page-container"
        >
            {match && <MatchEdit match={match} updateMatch={updateLiveMatch} />}
        </Container>
    );
};

export default MatchEditPage;
