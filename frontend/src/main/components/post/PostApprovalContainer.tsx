import type {Post} from "../../types/post.ts";
import MatchPostView from "./MatchPostView.tsx";
import PostView from "./PostView.tsx";
import {Box, Button, Group, Paper, Text, Stack} from "@mantine/core";
import {approve, disapprove} from "../../request/posts.ts";
import {useCallback,} from "react";
import {useAuth} from "../../hooks/useAuth.tsx";
import {isPlayer} from "../../types/accountTypes.ts";

interface PostApprovalContainerProps {
    post: Post;
    onApprove?: (post: Post) => void;
    onDisapprove?: (post: Post) => void;
    hasApprovalText?: boolean
}

function PostApprovalContainer({ post, onApprove, onDisapprove, hasApprovalText }: PostApprovalContainerProps) {

    const { currentAccount } = useAuth();

    const handleApproval = useCallback(async (approved: boolean) => {

        if (approved) {
            const approvedPost = await approve(post.id)
            if (approvedPost && onApprove) {
                onApprove(approvedPost);
            }
        } else {
            const res = await disapprove(post.id)

            if (res.ok && onDisapprove) {
                onDisapprove(post);
            }
        }
    }, [onApprove, onDisapprove, post]);

    return (
        <Paper p="md" withBorder>
            <Stack>
                <Group>
                    <Box
                        style={{ flex: 1 }}
                    >
                        {post.match ? (
                            <MatchPostView
                                post={post}
                            />
                        ) : (
                            <PostView
                                post={post}
                            />
                        )}
                    </Box>
                </Group>
                {hasApprovalText && (
                    <Text>
                        This post is currently pending approval...
                    </Text>
                )}
                { !isPlayer(currentAccount) &&
                    <Group>
                        <Button
                            data-testid="accept-button"
                            size="xs"
                            color="green"
                            onClick={() => handleApproval(true)}
                        >
                            Approve
                        </Button>
                        <Button
                            size="xs"
                            color="red"
                            onClick={() => handleApproval(false)}
                        >
                            Disapprove
                        </Button>
                    </Group>
                }
            </Stack>
        </Paper>
    )
}

export default PostApprovalContainer;
