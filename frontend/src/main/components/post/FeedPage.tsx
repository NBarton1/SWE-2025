import {Container, Stack} from "@mantine/core";
import {useEffect, useState} from "react";
import {getAllPosts} from "../../request/posts.ts";
import {comparePosts, type Post} from "../../types/post.ts";
import PostContainer from "./PostContainer.tsx";
import PostCreate from "./PostCreate.tsx";


function FeedPage() {

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        getAllPosts().then(posts => {
            posts.sort(comparePosts);
            setPosts(posts);
        });
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
                    />
                )}
            </Stack>
        </Container>
    );
}

export default FeedPage;
