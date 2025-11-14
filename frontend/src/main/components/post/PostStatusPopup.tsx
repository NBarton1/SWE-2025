import {Button, Modal, Stack, ThemeIcon, Title} from "@mantine/core";
import React, {type Dispatch} from "react";
import {IconCheck, IconX} from "@tabler/icons-react";


interface PostStatusPopupProps {
    open: boolean
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    error: boolean
}

function PostStatusPopup({ open, setOpen, error }: PostStatusPopupProps) {
    if (!open) return null;

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            size="md"
            centered
            withCloseButton={false}
            padding="xl"
        >
            <Stack align="center">
                {error ? (
                    <ThemeIcon color="red" size={60} radius="xl">
                        <IconX size={32} />
                    </ThemeIcon>
                ) : (
                    <ThemeIcon color="green" size={60} radius="xl">
                        <IconCheck size={32} />
                    </ThemeIcon>
                )}

                <Stack align="center">
                    <Title order={2} size="h3">
                        {error ? "Failed to Create Post" : "Post Created!"}
                    </Title>
                </Stack>

                <Button
                    onClick={() => setOpen(false)}
                    fullWidth
                    size="md"
                >
                    Return
                </Button>
            </Stack>
        </Modal>
    );
}

export default PostStatusPopup;
