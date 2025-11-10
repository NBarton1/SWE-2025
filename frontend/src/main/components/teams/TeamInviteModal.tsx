import { useEffect, useState } from "react";
import { Modal, Select, Button, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Player } from "../../types/accountTypes";
import {invitePlayerFromTeam} from "../../request/teams.ts";
import {getPlayers} from "../../request/players.ts";

interface InvitePlayerModalProps {
    opened: boolean;
    onClose: () => void;
}

const InvitePlayerModal = ({ opened, onClose }: InvitePlayerModalProps) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [error, setError] = useState<string>("");

    const form = useForm({ initialValues: { playerId: "" } });

    useEffect(() => {
        if (opened) {
            form.reset();
            setError("");
            getPlayers().then(setPlayers);
        }
    }, [opened]);

    const handleInvite = async () => {
        const playerId = Number(form.values.playerId);
        if (!playerId) return;

        const res = await invitePlayerFromTeam(playerId);
        if (!res.ok) {
            setError("Cannot send invite. They likely already have one from this team.");
            return;
        }

        setError("");
        onClose()
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Invite Player"
            data-testid="team-invite-modal"
        >
            <form data-testid="team-invite-modal-form" onSubmit={form.onSubmit(handleInvite)}>
                <Stack>
                    <Select
                        label="Select Player"
                        placeholder="Player name/username"
                        searchable
                        nothingFoundMessage="No players found"
                        data={players.map((player) => ({
                            value: player.account.id.toString(),
                            label: `${player.account.name} (${player.account.username})`,
                        }))}
                        {...form.getInputProps("playerId")}
                        required
                        data-testid="player-select"
                    />

                    {error && (
                        <Text c="red" size="sm" mt="sm">
                            {error}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        data-testid="team-invite-modal-submit-button"
                    >
                        Send Invite
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
};

export default InvitePlayerModal;
