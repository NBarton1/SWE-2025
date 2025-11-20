import {Container, Modal, Stack} from "@mantine/core";
import {useEffect, useState} from "react";
import {getAllPosts} from "../../request/posts.ts";
import {comparePosts, type Post} from "../../types/post.ts";
import PostContainer from "./PostContainer.tsx";
import MatchDetailsModalFields from "../schedule/MatchDetailsModalFields.tsx";
import type {Match} from "../../types/match.ts";
import {getTeams} from "../../request/teams.ts";
import type {Team} from "../../types/team.ts";
import PostCreate from "./PostCreate.tsx";


function FeedPage() {

    const [posts, setPosts] = useState<Post[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    useEffect(() => {
        getAllPosts().then(posts => {
            posts.sort(comparePosts);
            setPosts(posts);
        });

        getTeams().then(setTeams);
    }, []);

    console.log("POST:", posts);

    return (
        <Container size="md">
            <Stack gap="md">
                <PostCreate setPosts={setPosts} clearFormOnSubmit/>
                {posts.map((post) =>
                    <PostContainer
                        key={post.id}
                        post={post}
                        setPosts={setPosts}
                        setSelectedMatch={setSelectedMatch}
                    />
                )}
            </Stack>

            <Modal
                opened={selectedMatch != null}
                onClose={() => setSelectedMatch(null)}
                size="lg"
                data-testid="event-popup"
            >
                <MatchDetailsModalFields
                    match={selectedMatch}
                    setSelectedMatch={setSelectedMatch}
                    setMatches={() => 0} // TODO: placeholder for now, fix to update posts
                    teams={teams}
                />
            </Modal>
        </Container>
    );
}

export default FeedPage;
