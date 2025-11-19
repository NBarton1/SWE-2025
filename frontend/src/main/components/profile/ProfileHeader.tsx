import {
    Stack,
    Group,
    Text,
    Paper
} from '@mantine/core';
import {accountEquals, hasEditPermission, isValidRoleString} from '../../types/accountTypes';
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
import {ProfileViewState} from "./ProfileViewState.tsx";
import {ProfileEditState} from "./ProfileEditState.tsx";
import ProfileAvatar from "./ProfileAvatar.tsx";
import type {ProfileStateHandler} from "./ProfileStateHandler.tsx";

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
    const [profileStateHandler, setProfileStateHandler] = useState<ProfileStateHandler>(new ProfileViewState());
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
            name: (value) => (value.trim().length === 0 ? "Name is required" : null),
            username: (value) => (value.trim().length === 0 ? "Username is required" : null),
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
        setProfileStateHandler(new ProfileEditState());
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

        setProfileStateHandler(new ProfileViewState());
        setAccount(updatedAccount)
    }, [account, form, setAccount]);

    const cancel = useCallback(() => {
        form.reset();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null)
        }

        setProfileStateHandler(new ProfileViewState());
    }, [form, previewUrl]);

    const handleDelete = useCallback(async () => {
        if (!account) return;

        setProfileStateHandler(new ProfileViewState());

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

    }, [account, currentAccount, setAccount, logout]);


    return (
        <Paper shadow="md" radius="md" p="xl" withBorder data-testid="profile-header">
            {account ? (
                <form onSubmit={form.onSubmit(handleSubmit)} data-testid="profile-form">
                    <Stack gap="lg">
                        <Group justify="space-between" align="flex-start">
                            <Group align="flex-start">
                                <Stack gap="xs" align="center">
                                    <ProfileAvatar account={account} previewUrl={previewUrl} />

                                    {profileStateHandler.pictureUploadOption(form, setPreviewUrl)}
                                </Stack>

                                <Stack gap="xs" style={{flex: 1}}>
                                    {profileStateHandler.accountNamesFields(form, account)}

                                    <Group gap="xs" data-testid="role-section">
                                        {profileStateHandler.roleOptions(form, currentAccount, account)}
                                    </Group>
                                </Stack>
                            </Group>

                            {hasEditPermission(currentAccount, account) && (
                                profileStateHandler.editOptions(edit, cancel)
                            )}
                        </Group>

                        {profileStateHandler.accountDetailsOptions(form, currentAccount, handleDelete)}
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
