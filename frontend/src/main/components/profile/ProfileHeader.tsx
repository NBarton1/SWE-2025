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
import {accountEquals, isAdmin, isPlayer, isValidRoleString, Role} from '../../types/accountTypes';
import type {Account} from '../../types/accountTypes';
import {useCallback, useState} from 'react';
import {useForm, type UseFormReturnType} from '@mantine/form';
import {
    deleteAccount,
    updateAccount,
    updateAccountPicture,
    type UpdateAccountRequest
} from '../../request/accounts.ts';
import {useLogout} from "../../hooks/useLogout.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";

interface ProfileHeaderProps {
    account: Account | null;
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

const ProfileHeader = ({account, setAccount}: ProfileHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { logout } = useLogout()
    const { currentAccount } = useAuth()

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
    }, [account, form, setAccount]);

    const cancel = useCallback(() => {
        form.reset();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null)
        }
        setIsEditing(false);
    }, [form, previewUrl]);

    const handleDelete = useCallback(async () => {
        if (!account) return;

        setIsEditing(false);

        const deleted = await deleteAccount(account.id);
        if (!deleted) {
            console.error("Failed to delete account");
            return;
        }

        if (accountEquals(currentAccount, account)) {
            await logout();
            return;
        }

        setAccount(null);

    }, [account, currentAccount?.id, setAccount, logout]);


    return (
        <Paper shadow="md" radius="md" p="xl" withBorder data-testid="profile-header">
            {account ? (
                <form onSubmit={form.onSubmit(handleSubmit)} data-testid="profile-form">
                    <Stack gap="lg">
                        <Group justify="space-between" align="flex-start">
                            <Group align="flex-start">
                                <Stack gap="xs" align="center">
                                    <Avatar
                                        src={previewUrl ?? account?.picture?.downloadUrl}
                                        size={120}
                                        radius="md"
                                        name={account.name}
                                        data-testid="profile-avatar"
                                    />
                                    {isEditing &&
                                        <FileButton
                                            onChange={file => {
                                                form.setFieldValue("picture", file);

                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    setPreviewUrl(url);
                                                } else {
                                                    setPreviewUrl(null);
                                                }
                                            }}
                                            accept="image/png,image/jpeg,image/gif"
                                            data-testid="profile-picture-button"
                                        >
                                            {(props) => (
                                                <Button {...props} size="xs" variant="light" data-testid="change-picture-button">
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
                                                data-testid="form-name"
                                            />
                                            <TextInput
                                                label="Username"
                                                placeholder="Username"
                                                maxLength={32}
                                                required
                                                {...form.getInputProps("username")}
                                                data-testid="form-username"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Text size="xl" fw={700} data-testid="account-name">{account.name}</Text>
                                            <Text size="sm" c="dimmed" data-testid="account-username">@{account.username}</Text>
                                            {account.email &&
                                                <Text size="sm" data-testid="account-email">{account.email}</Text>
                                            }
                                        </>
                                    )}

                                    <Group gap="xs" data-testid="role-section">
                                        {!isEditing || (currentAccount && !isAdmin(currentAccount)) ?
                                            <Badge variant="light" data-testid="account-role">
                                                {account.role}
                                            </Badge>
                                            :
                                            <Select
                                                defaultValue={account.role}
                                                data={Object.values(Role)}
                                                searchable
                                                {...form.getInputProps("role")}
                                                data-testid="form-role-select"
                                            />
                                        }
                                    </Group>
                                </Stack>
                            </Group>

                            {currentAccount && ((account && account.id === currentAccount.id) || isAdmin(currentAccount)) && (
                                !isEditing ? (
                                    <Button variant="light" size="sm" onClick={edit} data-testid="edit-profile-button">
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Group gap="xs">
                                        <Button variant="light" color="green" size="sm" type="submit" data-testid="save-button">
                                            Save
                                        </Button>
                                        <Button variant="light" color="red" size="sm" onClick={cancel} data-testid="cancel-button">
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
                                            data-testid="form-email"
                                        />
                                    }
                                    <PasswordInput
                                        label="Password"
                                        size="sm"
                                        placeholder="Leave blank to keep current"
                                        {...form.getInputProps("password")}
                                        data-testid="form-password"
                                    />
                                    <PasswordInput
                                        label="Confirm Password"
                                        size="sm"
                                        placeholder="Confirm new password"
                                        {...form.getInputProps("confirmPassword")}
                                        data-testid="form-confirm-password"
                                    />
                                    <Button
                                        onClick={handleDelete}
                                        color="red"
                                        variant="filled"
                                        data-testid="delete-account-button"
                                    >
                                        Delete Account
                                    </Button>
                                </Stack>
                            </Group>
                        )}
                    </Stack>
                </form>
            ) : (
                <Stack align="center" data-testid="no-account">
                    <Text size="lg">The user you are looking for does not exist</Text>
                </Stack>
            )}
        </Paper>
    );
};

export default ProfileHeader;
