import {Container} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import { Client } from "@stomp/stompjs";
import type {Match} from "../../types/match.ts";
import LiveMatchView from "./LiveMatchView.tsx";
import {live_match_websocket} from "./live_match.ts";
import {useParams} from "react-router";


const LiveMatchViewPage = () => {
    const { id } = useParams<{ id: string }>();
    const matchId = Number(id);

    const [match, setMatch] = useState<Match | null>(null);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => live_match_websocket(matchId, setMatch, clientRef), []);

    return (
        <Container py="md">
            {match && <LiveMatchView match={match} />}
        </Container>
    );
};

export default LiveMatchViewPage;
