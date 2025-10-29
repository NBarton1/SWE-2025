import {AppShell, Group, Text, Menu, Button, ActionIcon, useMantineColorScheme} from '@mantine/core';
import {Home, BarChart3, Settings, ChevronDown, Sun, Moon} from 'lucide-react';
import { Outlet } from "react-router";

function Layout() {

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const menuItems = [
        {
            label: 'Home',
            icon: Home,
            items: [
                { label: 'Schedule', href: '/calendar' },
            ]
        },
        {
            label: 'Stats',
            icon: BarChart3,
            items: [
                {label: 'Team Stats', href: '/teams'},
            ]
        }
    ];

    return (
        <AppShell
            padding="md"
            header={{ height: 60 }}
            data-testid="layout-appshell"
        >
            <AppShell.Header>
                <Group h="100%" px="lg" justify="space-between">
                    <Group gap="xl">
                        <Text
                            size="xl"
                            fw={900}
                        >
                            LUM
                        </Text>

                        <Group gap="xs">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Menu
                                        key={index}
                                        trigger="hover"
                                        openDelay={100}
                                        closeDelay={200}
                                        position="bottom-start"
                                    >
                                        <Menu.Target>
                                            <Button>
                                                <Icon size={16} />
                                                {item.label}
                                                <ChevronDown size={14} />
                                            </Button>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            {item.items.map((subItem , subIndex) => (
                                                <Menu.Item
                                                    key={subIndex}
                                                    component="a"
                                                    href={subItem.href}
                                                >
                                                    {subItem.label}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Dropdown>
                                    </Menu>
                                );
                            })}
                        </Group>
                    </Group>

                    <Group gap="xs">
                        <ActionIcon
                            variant="default"
                            size="lg"
                            onClick={toggleColorScheme}
                            title="Toggle theme"
                            data-testid="theme-button"
                        >
                            {colorScheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </ActionIcon>

                        <Menu trigger="hover" openDelay={100} closeDelay={200}>
                            <Menu.Target>
                                <Button>
                                    <Settings size={16} />
                                    <ChevronDown size={14} />
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    component="a"
                                    href="/profile"
                                >
                                    Profile
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                    component="a"
                                    href="/login"
                                >
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;