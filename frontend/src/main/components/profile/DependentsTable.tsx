import {Button, Checkbox, Divider, Group, Paper, Stack, Text, Title} from "@mantine/core";
import {adoptPlayer, setPlayerPermission} from "../../request/players.ts";
import {type Account, type Player} from "../../types/accountTypes.ts";
import {useNavigate} from "react-router";
import {getDependents} from "../../request/accounts.ts";
import PlayerSelectorModal from "./PlayerSelectModal.tsx";
import {useEffect, useState} from "react";

interface DependentsTableProps {
    account: Account | null;
}

const DependentsTable = ({account}: DependentsTableProps) => {
    const [addPlayerModalOpen, setAddPlayerModalOpen] = useState(false);
    const [dependents, setDependents] = useState<Player[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        getDependents().then(setDependents);
    }, [account]);

    const handlePermissionChange = async (playerId: number, newValue: boolean) => {
        const result = await setPlayerPermission(playerId, newValue);
        if (!result) return

        setDependents((prev: Player[]) =>
            prev.map((d) =>
                d.account.id === playerId
                    ? {...d, hasPermission: newValue}
                    : d
            )
        );
    };

    return (
        <Paper shadow="sm" radius="md" p="xl" mt="md" withBorder>
            <Stack>
                <Group align="center" justify="space-between">
                    <Title order={3}>Your Dependents</Title>
                    <Button variant="light" size="sm" onClick={() => setAddPlayerModalOpen(true)}>
                        Add Player
                    </Button>
                </Group>
                <Divider/>

                {dependents.length === 0 ? (
                    <Text c="dimmed">You have no dependents.</Text>
                ) : (
                    dependents.map((dependent) => (
                        <Group
                            key={dependent.account.id}
                            justify="space-between"
                            style={{borderBottom: "1px solid #eee", padding: 8, cursor: "pointer"}}
                            onClick={(event) => {
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
                                onChange={(event) =>
                                    handlePermissionChange(dependent.account.id, event.currentTarget.checked)
                                }
                                onClick={(event) => event.stopPropagation()}
                            />
                        </Group>
                    ))
                )}
            </Stack>

            <PlayerSelectorModal
                opened={addPlayerModalOpen}
                onClose={() => setAddPlayerModalOpen(false)}
                title="Add Player"
                filter={{ isOrphan: true }}
                onConfirm={async (playerId: number) => {
                    const res = await adoptPlayer(playerId);
                    if (!res) throw new Error();

                    const updatedDependents = await getDependents();
                    setDependents(updatedDependents);
                }}
                errorMessage="Failed to add player. Please try again."
            />
        </Paper>
    );
};

export default DependentsTable;
