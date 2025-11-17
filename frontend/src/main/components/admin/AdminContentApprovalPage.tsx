import { useEffect, useState } from "react";
import type { Content } from "../../types/content.ts";
import {approveContent, deleteContent, getUnapprovedContent} from "../../request/content.ts";
import {Button, Card, Group, Image, Stack, Text, Title} from "@mantine/core";

const AdminContentApprovalPage = () => {
    const [content, setContent] = useState<Content[]>([])

    useEffect(() => {
        getUnapprovedContent().then(setContent)
    }, []);

    const removeItem = (id: number) => {
        setContent(prev => prev.filter(item => item.id !== id));
    };

    const approveItem = async (id: number) => {
        const approved = await approveContent(id);
        if (!approved) return;

        removeItem(id);
    };

    const disapproveItem = async (id: number) => {
        const deleted = await deleteContent(id);
        if (!deleted) return;

        removeItem(id);
    };


    return (
        <Stack p="md">
            <Title size="xl" fw={700}>Content Pending Approval</Title>

            {content.length === 0 && (
                <Text c="dimmed">No new content needs to be approved</Text>
            )}

            {content.map(item => (
                <Card key={item.id} withBorder shadow="sm" p="md" radius="md">
                    <Group align="flex-start">
                        {item.contentType.startsWith("image/") && (
                            <Image
                                src={item.downloadUrl}
                                w={120}
                                radius="md"
                                alt={item.filename}
                            />
                        )}

                        <Stack gap="xs" style={{ flex: 1 }}>
                            <Text fw={700}>{item.filename}</Text>
                            <Text size="sm" c="dimmed">
                                {item.contentType} · {(item.fileSize >> 10).toFixed(1)} KB
                            </Text>

                            <Group mt="sm">
                                <Button
                                    color="green"
                                    onClick={() => approveItem(item.id)}
                                >
                                    Approve
                                </Button>

                                <Button
                                    color="red"
                                    variant="outline"
                                    onClick={() => disapproveItem(item.id)}
                                >
                                    Delete
                                </Button>
                            </Group>
                        </Stack>
                    </Group>
                </Card>
            ))}
        </Stack>
    );
};

export default AdminContentApprovalPage;
