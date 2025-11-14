import {Button, Modal, Title} from "@mantine/core";
import React, {type Dispatch} from "react";


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
        >
            <Title>{error ? "Failed to Create Post!" : "Post Created!"}</Title>

            <Button
                onClick={() => setOpen(false)}
            >
                Close
            </Button>
        </Modal>
    );
}

export default PostStatusPopup;
