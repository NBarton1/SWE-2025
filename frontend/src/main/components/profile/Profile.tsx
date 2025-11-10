import { useCallback, useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Avatar,
    Text,
    Group,
    Stack,
    Badge,
    Button,
    TextInput,
    FileButton,
    PasswordInput,
    Title,
    Divider,
    Checkbox,
    Select,
} from '@mantine/core';
import {useForm, type UseFormReturnType} from '@mantine/form';
import '@mantine/core/styles.css';
import {
    type Account,
    type Player,
    accountEquals,
    isPlayer,
    isAdmin,
    Role,
    isValidRoleString,
} from "../../types/accountTypes.ts";
import {useNavigate, useParams} from "react-router";

import type {TeamInvite} from "../../types/invite.ts";
import {
    deleteAccount,
    getAccount, getDependents,
    updateAccount, updateAccountPicture,
    type UpdateAccountRequest,
} from "../../request/accounts.ts";
import {logout} from "../../request/auth.ts";
import {getInvites, respondToInvite} from "../../request/invites.ts";
import useLogin from "../../hooks/useLogin.tsx";
import PlayerCreateModal from "../signup/PlayerCreateModal.tsx";
import {setPlayerPermission} from "../../request/players.ts";

interface ProfileUpdateForm {
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string,
    picture: File | null,
}

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();

    const navigate = useNavigate();

    const [account, setAccount] = useState<Account | null>(null);
    const [invites, setInvites] = useState<TeamInvite[]>([]);
    const [dependents, setDependents] = useState<Player[]>([]);
    const [createPlayerModalOpen, setCreatePlayerModalOpen] = useState(false);
    const { currentAccount } = useLogin();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    const form: UseFormReturnType<ProfileUpdateForm> = useForm({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "GUARDIAN",
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

    const tryShowAccount = useCallback(() => {
        const id_num = Number(id);
        if (isNaN(id_num)) return;
        getAccount(id_num).then(account => {
            setAccount(account);
        });
    }, [id]);

    useEffect(() => {
        tryShowAccount();
    }, [tryShowAccount]);

    useEffect(() => {
        if (!accountEquals(currentAccount, account)) return;

        if (isPlayer(currentAccount)) {
            getInvites().then(setInvites);
        } else {
            getDependents().then(setDependents);
        }
    }, [account, currentAccount]);

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
        const { picture: pictureDirty, ...statusNoPicture} = formStatus

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
        await deleteAccount(account.id)
            .then(tryShowAccount)
        if (account.id === currentAccount?.id) {
            await logout()
                .then(() => navigate("/login"))
        }
    }, [account, currentAccount?.id, navigate, tryShowAccount])

    const handleRespond = async (teamId: number, accepted: boolean) => {
        const res = await respondToInvite(teamId, {isAccepted: accepted});
        if (!res) return;

        setInvites((prev) => prev.filter((i) => i.team.id !== teamId));
    };

    return (
        <Container size="md" py={40}>
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

                                    <Stack gap="xs" style={{ flex: 1 }}>
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
                                                {account.email && isPlayer(account) && <Text size="sm" >{account.email}</Text>}
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
                                    <Stack style={{ flex: 1 }}>
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

            {accountEquals(currentAccount, account) && (
                <Paper shadow="sm" radius="md" p="xl" mt="md" withBorder>
                    <Stack>
                        {isPlayer(currentAccount) ? (
                            <>
                                <Title order={3}>Team Invites</Title>
                                <Divider />
                                {invites.length === 0 ? (
                                    <Text c="dimmed">You have no pending invites.</Text>
                                ) : (
                                    invites.map(invite => (
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
                            </>
                        ) : (
                            <>
                                <Group align="center" justify="space-between">
                                    <Title order={3}>Your Dependents</Title>
                                    <Button size="xs" onClick={() => setCreatePlayerModalOpen(true)}>
                                        Create Player Account
                                    </Button>
                                </Group>
                                <Divider />

                                {dependents.length === 0 ? (
                                    <Text c="dimmed">You have no dependents.</Text>
                                ) : (
                                    dependents.map(dependent => (
                                        <Group
                                            key={dependent.account.id}
                                            justify="space-between"
                                            style={{ borderBottom: "1px solid #eee", padding: 8, cursor: "pointer" }}
                                            onClick={(event) => {
                                                // only navigate if the click was NOT on the checkbox
                                                if (!(event.target as HTMLElement).closest('.permission-checkbox')) {
                                                    navigate(`/profile/${dependent.account.id}`);
                                                }
                                            }}
                                        >
                                            <Text>
                                                {dependent.account.name} ({dependent.account.username})
                                            </Text>

                                            <Checkbox
                                                className="permission-checkbox"
                                                label="Allow to accept invites"
                                                checked={dependent.hasPermission}
                                                onChange={async (event) => {
                                                    event.stopPropagation();
                                                    const newValue = event.currentTarget.checked;

                                                    // optimistic update
                                                    setDependents((prev) =>
                                                        prev.map((d) =>
                                                            d.account.id === dependent.account.id
                                                                ? { ...d, hasPermission: newValue }
                                                                : d
                                                        )
                                                    );

                                                    const result = await setPlayerPermission(dependent.account.id, newValue);
                                                    console.log("Backend response:", result);
                                                    if (!result) {
                                                        // rollback on failure
                                                        setDependents((prev) =>
                                                            prev.map((d) =>
                                                                d.account.id === dependent.account.id
                                                                    ? { ...d, hasPermission: !newValue }
                                                                    : d
                                                            )
                                                        );
                                                    }

                                                }}
                                                onClick={(event) => event.stopPropagation()}
                                            />


                                        </Group>
                                    ))
                                )}
                            </>
                        )}
                    </Stack>
                </Paper>
            )}

            <PlayerCreateModal
                opened={createPlayerModalOpen}
                onClose={() => setCreatePlayerModalOpen(false)}
                onAdded={() => getDependents().then(setDependents)}
            />

        </Container>
    );
};

export default ProfilePage;
