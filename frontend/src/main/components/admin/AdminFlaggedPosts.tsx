import {useEffect, useState} from "react";
import type {Post} from "../../types/post.ts";
import {getFlaggedPosts} from "../../request/posts.ts";
import {Paper, Stack, Text, Title} from "@mantine/core";
import PostContainer from "../post/PostContainer.tsx";

const AdminFlaggedPosts = () => {
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        getFlaggedPosts().then(setPosts)
    }, [])

    return (
        <Stack
            data-testid="flagged-posts"
        >
            <Title size="xl" fw={700}>Flagged Posts</Title>

            {posts.length == 0 && (
                <Text
                    c="dimmed"
                    data-testid="no-flagged-posts-indicator"
                >
                    There are no flagged posts
                </Text>
            )}

            {posts.map(post => (
                <Paper p="md" withBorder>
                    <PostContainer
                        post={post}
                        setPosts={setPosts}
                    />
                </Paper>
            ))}
        </Stack>
    )
}

export default AdminFlaggedPosts