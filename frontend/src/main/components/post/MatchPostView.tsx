import { type Post } from "../../types/post.ts";
import '@mantine/carousel/styles.css';
import React, {type Dispatch} from "react";
import MatchView from "../match/MatchView.tsx";
import {Match} from "../../types/match.ts";
import MatchPostUpdateIcons from "./MatchPostUpdateIcons.tsx";
import {Box, Group} from "@mantine/core";


interface MatchPostViewProps {
    match: Match
    setPosts: Dispatch<React.SetStateAction<Post[]>>
    setSelectedMatch: Dispatch<React.SetStateAction<Match | null>>
}

function MatchPostView({ match, setPosts, setSelectedMatch }: MatchPostViewProps) {

    return (
        <Group
            justify="space-between"
            align="flex-start"
            wrap="nowrap"
        >
            <Box
                style={{ flex: 1 }}
            >
                <MatchView
                    match={match}
                    navigable={true}
                />
            </Box>

            <MatchPostUpdateIcons
                match={match}
                setPosts={setPosts}
                setSelectedMatch={setSelectedMatch}
            />
        </Group>
    )
}

export default MatchPostView;
