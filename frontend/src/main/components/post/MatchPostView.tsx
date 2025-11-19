import { type Post } from "../../types/post.ts";
import '@mantine/carousel/styles.css';
import React, {type Dispatch} from "react";
import MatchView from "../match/MatchView.tsx";
import {Match, type MatchResponse} from "../../types/match.ts";
import MatchPostUpdateIcons from "./MatchPostUpdateIcons.tsx";
import {Box, Group} from "@mantine/core";
import {hasEditPermission} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";


interface MatchPostViewProps {
    post: Post
    setPosts: Dispatch<React.SetStateAction<Post[]>>
    setSelectedMatch: Dispatch<React.SetStateAction<Match | null>>
}

function MatchPostView({ post, setPosts, setSelectedMatch }: MatchPostViewProps) {

    const match = new Match(post.match as MatchResponse);
    const {currentAccount} = useAuth();

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
                    borderless
                    match={match}
                    navigable={true}
                />
            </Box>

            {hasEditPermission(currentAccount, post.account) &&
                <MatchPostUpdateIcons
                    match={match}
                    setPosts={setPosts}
                    setSelectedMatch={setSelectedMatch}
                />
            }
        </Group>
    )
}

export default MatchPostView;
