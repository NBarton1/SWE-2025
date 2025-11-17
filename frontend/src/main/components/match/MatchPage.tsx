import {Container, Stack} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import { Client } from "@stomp/stompjs";
import {Match} from "../../types/match.ts";
import MatchView from "./MatchView.tsx";
import {live_match_websocket} from "./MatchWebSocket.ts";
import {useParams} from "react-router";
import {useAuth} from "../../hooks/useAuth.tsx";
import {isAdmin} from "../../types/accountTypes.ts";
import MatchEdit from "./MatchEdit.tsx";
import type {UpdateMatchRequest} from "../../request/matches.ts";


const MatchPage = () => {
    const { id } = useParams<{ id: string }>();
    const matchId = Number(id);

    const {currentAccount} = useAuth()

    const [match, setMatch] = useState<Match | null>(null);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => live_match_websocket(matchId, setMatch, clientRef), []);

    const updateMatch = (
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

    return match && (
        <Container
            data-testid="match-view-page"
            py="md"
        >
            <Stack gap="md">
                <MatchView
                    match={match}
                    navigable={false}
                />

                {isAdmin(currentAccount) &&
                    <MatchEdit
                        match={match}
                        updateMatch={updateMatch}
                    />
                }
            </Stack>
        </Container>
    );
};

export default MatchPage;
