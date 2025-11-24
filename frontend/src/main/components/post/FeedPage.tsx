import {Container, Stack} from "@mantine/core";
import {useCallback, useEffect, useState} from "react";
import {getAllPosts} from "../../request/posts.ts";
import {comparePosts, type Post} from "../../types/post.ts";
import PostContainer from "./PostContainer.tsx";
import PostCreate from "./PostCreate.tsx";
import PostApprovalContainer from "./PostApprovalContainer.tsx";


function FeedPage() {

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        getAllPosts().then(posts => {
            posts.sort(comparePosts);
            setPosts(posts);

            console.log("posts", posts);
        });
    }, []);

    const setApprovedPost = useCallback((post: Post) => {
        setPosts(prev => prev.map((p) => {
            if (p.id === post.id) {
                p.isApproved = true;
            }
            return p;
        }));
    }, []);

    const deleteDisapprovedPost = useCallback((post: Post) => {
        setPosts(prev => prev.filter((p) => p.id !== post.id));
    }, []);

    return (
        <Container
            size="md"
            data-testid="feed-page"
        >
            <Stack gap="md">
                <PostCreate setPosts={setPosts} clearFormOnSubmit/>
                {posts.map((post) =>
                    post.isApproved ?
                        <PostContainer
                            key={post.id}
                            post={post}
                            setPosts={setPosts}
                        />
                        :
                        <PostApprovalContainer
                            key={post.id}
                            post={post}
                            onApprove={setApprovedPost}
                            onDisapprove={deleteDisapprovedPost}
                            hasApprovalText
                        />
                )}
            </Stack>
        </Container>
    );
}

export default FeedPage;
