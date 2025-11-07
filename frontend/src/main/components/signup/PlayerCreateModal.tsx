import { Modal } from "@mantine/core";
import { useCallback } from "react";
import {createPlayer} from "../../request/players.ts";
import CreateAccountForm from "./CreateAccountForm.tsx";

interface AddDependentModalProps {
    opened: boolean;
    onClose: () => void;
    onAdded?: () => void;
}

const PlayerCreateModal = ({ opened, onClose, onAdded }: AddDependentModalProps) => {
    const handleAdd = useCallback(
        async (values: { name: string; username: string; password: string }) => {
            const res = await createPlayer({ ...values, role: "PLAYER" });
            if (res.ok && onAdded) {
                onAdded();
            }
            onClose();
        }, [onClose, onAdded]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Add Player"
            size="sm"
        >
            <CreateAccountForm
                onSubmit={handleAdd}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default PlayerCreateModal;
