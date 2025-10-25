import { AppShell, Burger, Group, Text, Stack, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Home, Users } from 'lucide-react';
import {Outlet} from "react-router";

function Layout() {
    const [opened, { toggle, close }] = useDisclosure();

    const navItems = [
        { icon: Home, label: 'Dashboard', href: '/calendar' },
        { icon: Users, label: 'Teams', href: '/teams' },
    ];

    return (
        <AppShell
            padding="md"
            header={{ height: 70 }}
            navbar={{
                width: 280,
                breakpoint: 'sm',
            }}
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Text size="xl" fw={700}>
                            League of United Minors
                        </Text>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Stack gap="xs">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={index}
                                href={item.href}
                                label={item.label}
                                leftSection={<Icon size={20} />}
                                onClick={close}
                            />
                        );
                    })}
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main><Outlet/></AppShell.Main>
        </AppShell>
    );
}

export default Layout;