import {AppShell, Group, Text, Menu, Button, ActionIcon, useMantineColorScheme} from '@mantine/core';
import {Home, BarChart3, Settings, ChevronDown, Sun, Moon, UserStar} from 'lucide-react';
import {Outlet} from "react-router";
import {useAuth} from "../../hooks/useAuth.tsx";
import {useMemo} from "react";
import {isAdmin} from "../../types/accountTypes.ts";
import {useLogout} from "../../hooks/useLogout.tsx";

function Layout() {

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const { currentAccount } = useAuth()
    const { logout } = useLogout()

    const menuItems = useMemo(() => {

        const items = [
            {
                label: "Home",
                icon: Home,
                items: [
                    { label: "Schedule", href: "/schedule" },
                    { label: "Feed", href: "/feed" },
                ]
            },
            {
                label: "Stats",
                icon: BarChart3,
                items: [
                    {label: "Team Stats", href: "/teams"},
                    {label: "Playoff Picture", href: "/playoff"},
                ]
            }
        ]


        const adminItems = [
            {
                label: "Admin",
                icon: UserStar,
                items: [
                    { label: "Accounts", href: "/accounts"},
                    { label: "Approve Content", href: "/content-approval"},
                    { label: "Flagged Posts", href: "/flagged-posts"}
                ]
            }
        ]

        if (isAdmin(currentAccount)) {
            items.push(...adminItems)
        }

        return items
    }, [currentAccount])

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
                                {currentAccount &&
                                    <>
                                        <Menu.Item
                                            component="a"
                                            href={`/profile/${currentAccount.id}`}
                                        >
                                            Profile
                                        </Menu.Item>
                                        <Menu.Divider />
                                    </>
                                }
                                {currentAccount ?
                                    <Menu.Item onClick={async () => await logout()}>
                                        Logout
                                    </Menu.Item>
                                    :
                                    <Menu.Item component="a" href="/login">
                                        Login
                                    </Menu.Item>
                                }
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
