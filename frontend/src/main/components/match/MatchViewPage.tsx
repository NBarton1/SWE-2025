import {Container} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import { Client } from "@stomp/stompjs";
import {Match} from "../../types/match.ts";
import MatchView from "./MatchView.tsx";
import {live_match_websocket} from "./MatchWebSocket.ts";
import {useParams} from "react-router";


const MatchViewPage = () => {
    const { id } = useParams<{ id: string }>();
    const matchId = Number(id);

    const [match, setMatch] = useState<Match | null>(null);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => live_match_websocket(matchId, setMatch, clientRef), []);

    return (
        <Container
            data-testid="live-match-view-page"
            py="md"
        >
            {match && <MatchView match={match} navigable={false} />}
        </Container>
    );
};

export default MatchViewPage;
