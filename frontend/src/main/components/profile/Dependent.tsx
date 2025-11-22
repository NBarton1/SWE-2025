import { Button, Checkbox, Collapse, Group, Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { ChevronDown } from "lucide-react";
import type { Player } from "../../types/accountTypes.ts";
import type { Post } from "../../types/post.ts";
import PostApprovalContainer from "../post/PostApprovalContainer.tsx";
import {useState} from "react";

interface DependentRowProps {
    dependent: Player;
    posts: Post[];
    onPermissionChange: (playerId: number, newValue: boolean) => void;
    onPostResolved: (postId: number) => void;
}

const Dependent = ({
                          dependent,
                          posts,
                          onPermissionChange,
                          onPostResolved,
                      }: DependentRowProps) => {


    const [isExpanded, setIsExpanded] = useState(false);

    const navigate = useNavigate();

    const handleRowClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (
            !(event.target as HTMLElement).closest(".permission-checkbox") &&
            !(event.target as HTMLElement).closest(".expand-button")
        ) {
            navigate(`/profile/${dependent.account.id}`);
        }
    };

    return (
        <Stack key={dependent.account.id} gap={0}>
            <Group
                justify="space-between"
                style={{ borderBottom: "1px solid #eee", padding: 8, cursor: "pointer" }}
                onClick={handleRowClick}
                data-testid={`dependent-${dependent.account.id}`}
            >
                <Group style={{ flex: 1 }}>
                    <Button
                        className="expand-button"
                        variant="subtle"
                        size="xs"
                        p={0}
                        onClick={() => setIsExpanded(!isExpanded)}
                        data-testid={`expand-button-${dependent.account.id}`}
                    >
                        <ChevronDown
                            size={20}
                            style={{
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s",
                            }}
                        />
                    </Button>
                    <Text>
                        {dependent.account.name} ({dependent.account.username})
                    </Text>
                </Group>

                <Checkbox
                    className="permission-checkbox"
                    label="Allow to accept invites"
                    checked={dependent.hasPermission}
                    onChange={(event) =>
                        onPermissionChange(dependent.account.id, event.currentTarget.checked)
                    }
                    onClick={(event) => event.stopPropagation()}
                    data-testid={`permission-checkbox-${dependent.account.id}`}
                />
            </Group>

            <Collapse in={isExpanded}>
                <Stack gap="xs">
                    <Text p={6} size="md" c="dimmed">
                        Unapproved Posts ({posts.length}):
                    </Text>
                    {posts.map((post) => (
                        <PostApprovalContainer
                            key={post.id}
                            post={post}
                            onApprove={(post) => onPostResolved(post.id)}
                            onDisapprove={(post) => onPostResolved(post.id)}
                        />
                    ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

export default Dependent;