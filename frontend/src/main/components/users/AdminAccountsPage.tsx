import {useState, useEffect} from 'react';
import {Table, Badge, Container, Title, Paper, Text} from '@mantine/core';
import {Link} from "react-router";
import type {Account} from "../../types/accountTypes.ts";
import {getAccounts} from "../../request/accounts.ts";


 const AdminAccountsPage = () => {
    const [users, setUsers] = useState<Account[]>([]);

    useEffect(() => {
        getAccounts().then(setUsers)
    }, []);

    const rows = users.sort((a, b) => a.id - b.id).map((user) => (
        <Table.Tr key={user.id}>
            <Table.Td>{user.id}</Table.Td>
            <Table.Td><Link to={`/profile/${user.id}`}>{user.name}</Link></Table.Td>
            <Table.Td>{user.username}</Table.Td>
            <Table.Td>
                {user.email ? (
                    <Text size="sm">{user.email}</Text>
                ) : (
                    <Text size="sm" c="dimmed">N/A</Text>
                )}
            </Table.Td>
            <Table.Td>
                <Badge variant="light">
                    {user.role}
                </Badge>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container size="xl" py="xl">
            <Paper shadow="sm" p="md" withBorder>
                <Title order={2} mb="md">Users</Title>

                <Table.ScrollContainer minWidth={500}>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Username</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Role</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows.length > 0 ? rows : (
                                <Table.Tr>
                                    <Table.Td colSpan={5}>
                                        <Text ta="center" c="dimmed">No users found</Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>
        </Container>
    );
}

export default AdminAccountsPage;