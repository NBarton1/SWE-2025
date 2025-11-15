import {Container, Stack} from "@mantine/core";
import PostView from "./PostView.tsx";
import {useEffect, useState} from "react";
import {getAllPosts} from "../../request/post.ts";
import {comparePosts} from "../../types/post.ts";


function ViewAllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        console.log("Getting All posts");
        getAllPosts().then(posts => {
            posts.sort(comparePosts);
            setPosts(posts);
        });
    }, []);

    return (
        <Container size="md">
            <Stack gap="md">
                {posts.map((post) => <PostView post={post}/>)}
            </Stack>
        </Container>
    );
}

export default ViewAllPosts;
