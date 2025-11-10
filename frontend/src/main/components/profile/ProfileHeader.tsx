import {
    Avatar,
    Stack,
    Group,
    Text,
    Badge,
    Button,
    TextInput,
    FileButton,
    PasswordInput,
    Select,
    Paper
} from '@mantine/core';
import {isAdmin, isPlayer, isValidRoleString, Role} from '../../types/accountTypes';
import type {Account} from '../../types/accountTypes';
import {useCallback, useState} from 'react';
import {useForm, type UseFormReturnType} from '@mantine/form';
import {
    deleteAccount,
    updateAccount,
    updateAccountPicture,
    type UpdateAccountRequest
} from '../../request/accounts.ts';
import {logout} from "../../request/auth.ts";
import {useNavigate} from "react-router";

interface ProfileHeaderProps {
    account: Account | null;
    currentAccount: Account | null;
    setAccount: (account: Account | null) => void;
}

interface ProfileUpdateForm {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    picture: File | null;
}

const ProfileHeader = ({account, currentAccount, setAccount}: ProfileHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const navigate = useNavigate();

    const form: UseFormReturnType<ProfileUpdateForm> = useForm({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
            picture: null as File | null
        },
        validate: {
            name: (value) => (isEditing && value.trim().length === 0 ? "Name is required" : null),
            username: (value) => (isEditing && value.trim().length === 0 ? "Username is required" : null),
            email: (value) => (value && value.trim().length > 0 && !/^\S+@\S+$/.test(value) ? "Invalid email" : null),
            password: (value) => {
                if (!value) return null;
                if (value.length < 8) return "Password must be at least 8 characters";
                return null;
            },
            role: (value) => {
                if (!isValidRoleString(value)) return "Please select a valid role";
                return null
            },
            confirmPassword: (value, values) => {
                if (!values.password || values.password.trim().length === 0) return null;
                return value !== values.password ? "Passwords do not match" : null;
            },
        }
    });

    const edit = useCallback(() => {
        if (!account) return;
        form.setValues({
            name: account.name,
            username: account.username,
            email: account.email || "",
            role: account.role,
            password: "",
            confirmPassword: "",
        });
        form.resetDirty()
        setIsEditing(true);
    }, [account, form]);

    const handleSubmit = useCallback(async (values: typeof form.values) => {
        if (!account) return;

        const formStatus = form.getDirty()

        // Picture needs to be handled separately
        const {picture: pictureDirty, ...statusNoPicture} = formStatus

        const dirtyV = Object.fromEntries(
            Object.entries(statusNoPicture)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isDirty]) => isDirty)
                .map(([key]) => [key, values[key as keyof typeof values]])
        ) as Partial<typeof values>;

        const updateAccountRequest: UpdateAccountRequest = dirtyV as UpdateAccountRequest
        console.log(updateAccountRequest)
        const updatedAccount: Account | null = await updateAccount(account.id, updateAccountRequest);

        if (pictureDirty && values.picture) {
            await updateAccountPicture(account.id, values.picture)
        }

        if (updatedAccount === null) return

        setIsEditing(false);
        setAccount(updatedAccount)
    }, [account, form]);

    const cancel = useCallback(() => {
        form.reset();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null)
        }
        setIsEditing(false);
    }, [form, previewUrl]);

    const handleDelete = useCallback(async () => {
        if (!account) return

        setIsEditing(false)
        const deleted = await deleteAccount(account.id)
        if (!deleted) return


        if (account.id === currentAccount?.id) {
            await logout()
                .then(() => navigate("/login"))
        }
        setAccount(null)
    }, [account, currentAccount?.id, navigate])

    return (
        <Paper shadow="md" radius="md" p="xl" withBorder>
            {account ? (
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="lg">
                        <Group justify="space-between" align="flex-start">
                            <Group align="flex-start">
                                <Stack gap="xs" align="center">
                                    <Avatar
                                        src={previewUrl ?? account?.picture?.downloadUrl}
                                        size={120}
                                        radius="md"
                                        name={account.name}
                                    />
                                    {isEditing &&
                                        <FileButton

                                            onChange={file => {
                                                form.setFieldValue("picture", file);

                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    setPreviewUrl(url);
                                                } else {
                                                    // this is only to empty the image since it's invalid
                                                    setPreviewUrl(null);
                                                }
                                            }}
                                            accept="image/png,image/jpeg,image/gif"
                                        >
                                            {(props) => (
                                                <Button {...props} size="xs" variant="light">
                                                    Change Picture
                                                </Button>
                                            )}
                                        </FileButton>
                                    }
                                </Stack>

                                <Stack gap="xs" style={{flex: 1}}>
                                    {isEditing ? (
                                        <>
                                            <TextInput
                                                label="Name"
                                                placeholder="Name"
                                                maxLength={32}
                                                required
                                                {...form.getInputProps("name")}
                                            />
                                            <TextInput
                                                label="Username"
                                                placeholder="Username"
                                                maxLength={32}
                                                required
                                                {...form.getInputProps("username")}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Text size="xl" fw={700}>{account.name}</Text>
                                            <Text size="sm" c="dimmed">@{account.username}</Text>
                                            {account.email && isPlayer(account) &&
                                                <Text size="sm">{account.email}</Text>}
                                        </>
                                    )}

                                    <Group gap="xs">
                                        {!isEditing || (currentAccount && !isAdmin(currentAccount)) ?
                                            <Badge variant="light">
                                                {account.role}
                                            </Badge>
                                            :
                                            <Select
                                                defaultValue={account.role}
                                                data={Object.values(Role)}
                                                searchable
                                                {...form.getInputProps("role")}
                                            >

                                            </Select>
                                        }
                                    </Group>
                                </Stack>
                            </Group>
                            {currentAccount && ((account && account.id === currentAccount.id) || isAdmin(currentAccount)) && (
                                !isEditing ? (
                                    <Button variant="light" size="sm" onClick={edit}>
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Group gap="xs">
                                        <Button variant="light" color="green" size="sm" type="submit">
                                            Save
                                        </Button>
                                        <Button variant="light" color="red" size="sm" onClick={cancel}>
                                            Cancel
                                        </Button>
                                    </Group>
                                )
                            )}
                        </Group>

                        {isEditing && (
                            <Group align="flex-start">
                                <Stack style={{flex: 1}}>
                                    {!isPlayer(currentAccount) &&
                                        <TextInput
                                            label="Email"
                                            size="sm"
                                            placeholder="user@example.com"
                                            {...form.getInputProps("email")}
                                        />
                                    }
                                    <PasswordInput
                                        label="Password"
                                        size="sm"
                                        placeholder="Leave blank to keep current"
                                        {...form.getInputProps("password")}
                                    />
                                    <PasswordInput
                                        label="Confirm Password"
                                        size="sm"
                                        placeholder="Confirm new password"
                                        {...form.getInputProps("confirmPassword")}
                                    />
                                    <Button
                                        onClick={handleDelete}
                                        color="red"
                                        variant="filled"
                                    >
                                        Delete Account
                                    </Button>
                                </Stack>
                            </Group>
                        )}
                    </Stack>
                </form>
            ) : (
                <Stack align="center">
                    <Text size="lg">The user you are looking for does not exist</Text>
                </Stack>
            )}
        </Paper>
    );
};

export default ProfileHeader;
