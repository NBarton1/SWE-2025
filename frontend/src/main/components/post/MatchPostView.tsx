import { type Post } from "../../types/post.ts";
import '@mantine/carousel/styles.css';
import MatchView from "../match/MatchView.tsx";
import {Match, type MatchResponse} from "../../types/match.ts";
import {Box, Group} from "@mantine/core";


interface MatchPostViewProps {
    post: Post
}

function MatchPostView({ post }: MatchPostViewProps) {

    const match = new Match(post.match as MatchResponse);

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
        </Group>
    )
}

export default MatchPostView;
