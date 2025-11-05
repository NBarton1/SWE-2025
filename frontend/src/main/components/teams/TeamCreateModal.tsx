import {
    TextInput,
    Button,
    Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {assignCoachToTeam, createTeam} from "../../request/teams.ts";
import type {Team} from "../../types/team.ts";

interface TeamCreateModalProps {
    opened: boolean;
    onClose: () => void;
    onTeamCreated: (team: Team) => void;
}

interface TeamCreateModalProps {
    opened: boolean;
    onClose: () => void;
    onTeamCreated: (team: Team) => void; // new team callback
}

const TeamCreateModal = ({ opened, onClose, onTeamCreated }: TeamCreateModalProps) => {
    const form = useForm({ initialValues: { name: "" } });

    const handleSubmit = async () => {
        const response = await createTeam({ name: form.values.name });
        if (!response.ok) return;

        const createdTeam: Team = await response.json();
        await assignCoachToTeam(createdTeam.id);

        onTeamCreated(createdTeam);
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Create Team">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput label="Team Name" {...form.getInputProps("name")} required />
                <Button type="submit" mt="md">Create</Button>
            </form>
        </Modal>
    );
};

export default TeamCreateModal;