import { Button, Divider, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { adoptPlayer, setPlayerPermission } from "../../request/players.ts";
import type { Account, Player } from "../../types/accountTypes.ts";
import { getDependents } from "../../request/accounts.ts";
import PlayerSelectorModal from "./PlayerSelectModal.tsx";
import { useCallback, useEffect, useState } from "react";
import type { Post } from "../../types/post.ts";
import { getUnapprovedPostsForChildren } from "../../request/posts.ts";
import Dependent from "./Dependent.tsx";

interface DependentsTableProps {
    account: Account | null;
}

const DependentsTable = ({ account }: DependentsTableProps) => {
    const [addPlayerModalOpen, setAddPlayerModalOpen] = useState(false);
    const [dependents, setDependents] = useState<Player[]>([]);
    const [unapprovedPosts, setUnapprovedPosts] = useState<Record<number, Post[]>>({});

    useEffect(() => {
        getDependents().then(setDependents);
        getUnapprovedPostsForChildren().then(setUnapprovedPosts);
    }, [account]);

    const handlePermissionChange = useCallback(async (playerId: number, newValue: boolean) => {
        const result = await setPlayerPermission(playerId, newValue);
        if (!result) return;

        setDependents((prev: Player[]) =>
            prev.map((d) =>
                d.account.id === playerId ? { ...d, hasPermission: newValue } : d
            )
        );
    }, []);

    const handlePostResolved = useCallback((childId: number, postId: number) => {
        setUnapprovedPosts((prev) => ({
            ...prev,
            [childId]: prev[childId].filter((p) => p.id !== postId),
        }));
    }, []);

    return (
        <Paper shadow="sm" radius="md" p="xl" withBorder>
            <Stack>
                <Group align="center" justify="space-between">
                    <Title order={3} data-testid="dependents-title">
                        Your Dependents
                    </Title>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={() => setAddPlayerModalOpen(true)}
                        data-testid="add-player-button"
                    >
                        Add Player
                    </Button>
                </Group>
                <Divider />

                {dependents.length === 0 ? (
                    <Text data-testid="empty-state" c="dimmed">
                        You have no dependents.
                    </Text>
                ) : (
                    dependents.map((dependent) => {
                        const posts = unapprovedPosts[dependent.account.id] || [];

                        return (
                            <Dependent
                                key={dependent.account.id}
                                dependent={dependent}
                                posts={posts}
                                onPermissionChange={handlePermissionChange}
                                onPostResolved={(postId) => handlePostResolved(dependent.account.id, postId)}
                            />
                        );
                    })
                )}
            </Stack>

            <PlayerSelectorModal
                opened={addPlayerModalOpen}
                onClose={() => setAddPlayerModalOpen(false)}
                title="Add Player"
                filter={{ isOrphan: true }}
                onConfirm={async (playerId: number) => {
                    const res = await adoptPlayer(playerId);
                    if (!res) throw new Error();

                    const updatedDependents = await getDependents();
                    setDependents(updatedDependents);
                }}
                errorMessage="Failed to add player. Please try again."
                data-testid="player-selector-modal"
            />
        </Paper>
    );
};

export default DependentsTable;