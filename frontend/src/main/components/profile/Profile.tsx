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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/core/styles.css';
import { type Account, type Player, accountEquals, isPlayer } from "../../types/accountTypes.ts";
import { useParams, useNavigate } from "react-router";
import { getAccount, getDependents, updateAccount } from "../../request/accounts.ts";
import { getInvites, respondToInvite } from "../../request/invites.ts";
import useLogin from "../../hooks/useLogin.tsx";
import type { TeamInvite } from "../../types/invite.ts";
import PlayerCreateModal from "../signup/PlayerCreateModal.tsx";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const [account, setAccount] = useState<Account | null>(null);
    const [invites, setInvites] = useState<TeamInvite[]>([]);
    const [dependents, setDependents] = useState<Player[]>([]);
    const [createPlayerModalOpen, setCreatePlayerModalOpen] = useState(false);
    const { currentAccount } = useLogin();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            name: (value) => (isEditing && value.trim().length === 0 ? 'Name is required' : null),
            username: (value) => (isEditing && value.trim().length === 0 ? 'Username is required' : null),
            email: (value) => (isEditing && value && !/^\S+@\S+$/.test(value) ? 'Invalid email' : null),
            password: (value, _) => {
                if (!value) return null;
                if (value.length < 8) return 'Password must be at least 8 characters';
                return null;
            },
            confirmPassword: (value, values) => {
                if (!values.password) return null;
                return value !== values.password ? 'Passwords do not match' : null;
            },
        },
    });

    useEffect(() => {
        const id_num = Number(id);
        if (isNaN(id_num)) return;
        getAccount(id_num).then(account => {
            if (account == null) return
            setAccount(account);
            form.setValues({
                name: account.name,
                username: account.username,
                email: '',
                password: '',
                confirmPassword: '',
            });
        });
    }, [id]);

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
            email: '',
            password: '',
            confirmPassword: '',
        });
        setIsEditing(true);
    }, [account]);

    const handleSubmit = useCallback(async (values: typeof form.values) => {
        if (!account) return;

        const updatedAccount = {
            ...account,
            name: values.name,
            username: values.username,
            password: values.password,
            email: values.email,
        };

        await updateAccount(updatedAccount);
        setAccount(updatedAccount);
        setIsEditing(false);
    }, [account]);

    const cancel = useCallback(() => {
        form.reset();
        setIsEditing(false);
    }, []);

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
                                            src={null}
                                            size={120}
                                            radius="md"
                                            name={account.name}
                                        />
                                        {isEditing && (
                                            <FileButton
                                                onChange={() => {}}
                                                accept="image/png,image/jpeg"
                                            >
                                                {(props) => (
                                                    <Button {...props} size="xs" variant="light">
                                                        Change Picture
                                                    </Button>
                                                )}
                                            </FileButton>
                                        )}
                                    </Stack>

                                    <Stack gap="xs" style={{ flex: 1 }}>
                                        {isEditing ? (
                                            <>
                                                <TextInput
                                                    label="Name"
                                                    placeholder="Name"
                                                    maxLength={32}
                                                    required
                                                    {...form.getInputProps('name')}
                                                />
                                                <TextInput
                                                    label="Username"
                                                    placeholder="Username"
                                                    maxLength={32}
                                                    required
                                                    {...form.getInputProps('username')}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Text size="xl" fw={700}>{account.name}</Text>
                                                <Text size="sm" c="dimmed">@{account.username}</Text>
                                            </>
                                        )}
                                        <Group gap="xs">
                                            <Badge variant="light">
                                                {account.role}
                                            </Badge>
                                        </Group>
                                    </Stack>
                                </Group>

                                {!isEditing ? (
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
                                )}
                            </Group>

                            {isEditing && (
                                <Group align="flex-start">
                                    <Stack style={{ flex: 1 }}>
                                        <TextInput
                                            label="Email"
                                            size="sm"
                                            placeholder="user@example.com"
                                            {...form.getInputProps('email')}
                                        />
                                        <PasswordInput
                                            label="Password"
                                            size="sm"
                                            placeholder="Leave blank to keep current"
                                            {...form.getInputProps('password')}
                                        />
                                        <PasswordInput
                                            label="Confirm Password"
                                            size="sm"
                                            placeholder="Confirm new password"
                                            {...form.getInputProps('confirmPassword')}
                                        />
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
                                            onClick={() => navigate(`/profile/${dependent.account.id}`)}
                                        >
                                            <Text>
                                                {dependent.account.name} ({dependent.account.username})
                                            </Text>
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
