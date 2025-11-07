import { TextInput, PasswordInput, Button, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";

interface FormValues {
    name: string;
    username: string;
    password: string;
}

interface AccountFormProps {
    onSubmit: (values: FormValues) => Promise<void>;
    onCancel?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
}

const AccountForm = ({
                         onSubmit,
                         onCancel,
                         submitLabel = "Create",
                         cancelLabel = "Cancel",
                     }: AccountFormProps) => {
    const form = useForm({
        initialValues: { name: "", username: "", password: "" },
        validate: {
            name: (value) => (value.trim().length < 2 ? "Name must have at least 2 characters" : null),
            username: (value) => (value.trim().length < 3 ? "Username must be at least 3 characters" : null),
            password: (value) => (value.length < 8 ? "Password must be at least 8 characters" : null),
        },
    });

    const handleSubmit = useCallback(async () => {
        await onSubmit(form.values);
    }, [form.values, onSubmit]);

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput label="Full Name" placeholder="Enter name" {...form.getInputProps("name")} required />
                <TextInput label="Username" placeholder="Enter username" {...form.getInputProps("username")} required />
                <PasswordInput label="Password" placeholder="Enter password" {...form.getInputProps("password")} required />

                <Group mt="md" grow>
                    <Button type="submit" variant="filled">
                        {submitLabel}
                    </Button>
                    {onCancel && (
                        <Button variant="outline" onClick={onCancel}>
                            {cancelLabel}
                        </Button>
                    )}
                </Group>
            </Stack>
        </form>
    );
};

export default AccountForm;
