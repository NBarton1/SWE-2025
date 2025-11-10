import { useEffect, useState } from "react";
import { Modal, Select, Button, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Player } from "../../types/accountTypes";
import {type PlayerFilter, searchPlayers} from "../../request/players";

interface PlayerSelectorModalProps {
    opened: boolean;
    onClose: () => void;
    title?: string;
    confirmLabel?: string;
    filter?: PlayerFilter;
    onConfirm: (playerId: number) => Promise<void> | void;
    errorMessage: string;
}

const PlayerSelectorModal = ({
                                 opened,
                                 onClose,
                                 title = "Select Player",
                                 confirmLabel = "Confirm",
                                 filter,
                                 onConfirm,
                                 errorMessage = "An error occurred"
                             }: PlayerSelectorModalProps) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [error, setError] = useState<string>("");

    const form = useForm({ initialValues: { playerId: "" } });

    useEffect(() => {
        if (opened) {
            form.reset();
            setError("");
            searchPlayers(filter).then(setPlayers).catch(() => setPlayers([]));
        }
    }, [opened, filter]);

    const handleConfirm = async () => {
        const playerId = Number(form.values.playerId);
        if (!playerId) return;

        try {
            await onConfirm(playerId);
            setError("");
            onClose();
        } catch (err) {
            setError(errorMessage);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={title}
            data-testid="player-selector-modal"
        >
            <form onSubmit={form.onSubmit(handleConfirm)}>
                <Stack>
                    <Select
                        label="Player"
                        placeholder="Search players..."
                        searchable
                        nothingFoundMessage="No players found"
                        data={players.map((p) => ({
                            value: p.account.id.toString(),
                            label: `${p.account.name} (${p.account.username})`,
                        }))}
                        {...form.getInputProps("playerId")}
                        required
                    />

                    {error && (
                        <Text c="red" size="sm">
                            {error}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        data-testid="player-select-submit-form"
                    >
                        {confirmLabel}
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
};

export default PlayerSelectorModal;
