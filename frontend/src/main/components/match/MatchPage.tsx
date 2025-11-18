import {Container, Group, Stack} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import { Client } from "@stomp/stompjs";
import {Match} from "../../types/match.ts";
import MatchView from "./MatchView.tsx";
import {live_match_websocket} from "./MatchWebSocket.ts";
import {useParams} from "react-router";
import {useAuth} from "../../hooks/useAuth.tsx";
import {isAdmin} from "../../types/accountTypes.ts";
import MatchEdit from "./MatchEdit.tsx";
import {getMatches, type UpdateMatchRequest} from "../../request/matches.ts";
import MatchDelete from "./MatchDelete.tsx";


const MatchPage = () => {
    const { id } = useParams<{ id: string }>();
    const matchId = Number(id);

    const {currentAccount} = useAuth();

    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        getMatches().then(setMatches);
    }, []);

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
        >
            <Group
                gap="xs"
                wrap="nowrap"
                align="flex-start"
            >
                <Stack style={{ flex: 1 }} gap="md">
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
                {isAdmin(currentAccount) &&
                    <MatchDelete match={match} matches={matches} setMatches={setMatches} />
                }
            </Group>
        </Container>
    );
};

export default MatchPage;
