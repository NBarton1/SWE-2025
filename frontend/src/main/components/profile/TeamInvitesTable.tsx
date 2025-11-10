import { Button, Divider, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { TeamInvite } from "../../types/invite.ts";
import {getInvites, respondToInvite} from "../../request/invites.ts";
import {type Account} from "../../types/accountTypes.ts";
import {useEffect, useState} from "react";

interface TeamInvitesTableProps {
    account: Account | null;
}

const TeamInvitesTable = ({ account }: TeamInvitesTableProps) => {
    const [invites, setInvites] = useState<TeamInvite[]>([]);

    useEffect(() => {
        getInvites().then(setInvites);
    }, [account]);

    const handleRespond = async (teamId: number, accepted: boolean) => {
        const res = await respondToInvite(teamId, { isAccepted: accepted });
        if (!res) return;

        setInvites(invites.filter((i) => i.team.id !== teamId));
    };

    return (
        <Paper shadow="sm" radius="md" p="xl" mt="md" withBorder>
            <Stack>
                <Title order={3}>Team Invites</Title>
                <Divider />
                {invites.length === 0 ? (
                    <Text c="dimmed">You have no pending invites.</Text>
                ) : (
                    invites.map((invite) => (
                        <Group
                            key={invite.team.id}
                            justify="space-between"
                            style={{ borderBottom: "1px solid #eee", paddingBottom: 8 }}
                        >
                            <Text>
                                You’ve been invited to join <b>{invite.team.name}</b>
                            </Text>
                            <Group>
                                <Button
                                    size="xs"
                                    color="green"
                                    onClick={() => handleRespond(invite.team.id, true)}
                                >
                                    Accept
                                </Button>
                                <Button
                                    size="xs"
                                    color="red"
                                    onClick={() => handleRespond(invite.team.id, false)}
                                >
                                    Decline
                                </Button>
                            </Group>
                        </Group>
                    ))
                )}
            </Stack>
        </Paper>
    );
};

export default TeamInvitesTable;
