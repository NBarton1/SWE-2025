import {Container, Group, Stack} from "@mantine/core";
import {useEffect, useRef, useState} from "react";
import { Client } from "@stomp/stompjs";
import {Match} from "../../types/match.ts";
import MatchView from "./MatchView.tsx";
import {createMatchWebsocket, updateMatchCallback} from "./MatchWebSocket.ts";
import {useParams} from "react-router";
import {useAuth} from "../../hooks/useAuth.tsx";
import {isAdmin} from "../../types/accountTypes.ts";
import MatchEdit from "./MatchEdit.tsx";


const MatchPage = () => {
    const { id } = useParams<{ id: string }>();
    const matchId = Number(id);

    const {currentAccount} = useAuth();

    const [match, setMatch] = useState<Match | null>(null);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => createMatchWebsocket(matchId, setMatch, clientRef), []);

    const updateMatch = updateMatchCallback(matchId, clientRef);

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
            </Group>
        </Container>
    );
};

export default MatchPage;
