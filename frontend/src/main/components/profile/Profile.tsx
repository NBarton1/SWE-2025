import {useCallback, useEffect, useMemo, useState} from 'react';
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
    PasswordInput
} from '@mantine/core';
import '@mantine/core/styles.css';
import type {Account} from "../../types/accountTypes.ts";
import {useParams} from "react-router";
import {getAccount, updateAccount} from "../../request/accounts.ts";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const id_num = Number(id)
        if (isNaN(id_num)) return
        getAccount(id_num).then(account => setAccount(account))
    }, [id]);

    const [account, setAccount] = useState<Account | null>(null);

    const [editedAccount, setEditedAccount] = useState(account);


    const editedPictureUrl = useMemo(() => {
        if (editedAccount === null) return null;
        if (editedAccount.picture === null) return null;
        const blob = new Blob([editedAccount.picture]);
        return URL.createObjectURL(blob);
    }, [editedAccount]);

    const pictureUrl = useMemo(() => {
        if (account === null) return null;
        if (account.picture === null) return null;
        const blob = new Blob([account.picture]);
        return URL.createObjectURL(blob);
    }, [account]);

    const edit = useCallback(() => {
        setEditedAccount(account);
        setIsEditing(true);
    },[account]);

    const save = useCallback(async () => {
        setAccount(editedAccount);
        setIsEditing(false);
        if (editedAccount === null) return;
        await updateAccount({...editedAccount});
    },[editedAccount]);

    const cancel =  useCallback(() => {
        setEditedAccount(account);
        setIsEditing(false);
    },[account]);

    return (
        <Container size="md" py={40}>
            <Paper shadow="md" radius="md" p="xl" withBorder>
                {account ?
                    <Stack gap="lg">
                        <Group justify="space-between" align="flex-start">
                            <Group align="flex-start">
                                <Stack gap="xs" align="center">
                                    <Avatar
                                        src={isEditing ? editedPictureUrl : pictureUrl}
                                        size={120}
                                        radius="md"
                                        name={account.name}
                                    />
                                    {isEditing && editedAccount && (
                                        <FileButton
                                            onChange={async picture => {
                                                if (picture === null) return
                                                const pictureBuffer = await picture.arrayBuffer()
                                                setEditedAccount({...editedAccount, picture: pictureBuffer})
                                            }}
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
                                    {isEditing && editedAccount ? (
                                        <>
                                            <TextInput
                                                label="Name"
                                                value={editedAccount.name}
                                                onChange={(e) => setEditedAccount({ ...editedAccount, name: e.target.value })}
                                                placeholder="Name"
                                                maxLength={32}
                                                required
                                            />
                                            <TextInput
                                                label="Username"
                                                value={editedAccount.username}
                                                onChange={(e) => setEditedAccount({ ...editedAccount, username: e.target.value })}
                                                placeholder="Username"
                                                maxLength={32}
                                                required
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
                                    <Button variant="light" color="green" size="sm" onClick={save}>
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
                                    <TextInput label="Email" size="sm"/>
                                    <PasswordInput label="Password" size="sm"/>
                                    <PasswordInput label="Confirm Password" size="sm"/>
                                </Stack>
                            </Group>
                        )}

                        {/*<Divider />*/}


                    </Stack>
                    :
                    <Stack align="center">
                        <Text size="lg">The user you are looking for does not exist</Text>
                    </Stack>
                }
            </Paper>
        </Container>
    );
}

export default ProfilePage;