import {Container, Stack} from "@mantine/core";
import PostView from "./PostView.tsx";
import {useEffect, useState} from "react";
import {getAllPosts} from "../../request/post.ts";


function ViewAllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        console.log("Getting All posts");
        getAllPosts().then(setPosts);
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
