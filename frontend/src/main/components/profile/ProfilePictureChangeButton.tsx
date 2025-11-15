import {
    Button,
    FileButton,
} from '@mantine/core';
import type {UseFormReturnType} from "@mantine/form";
import type {ProfileUpdateForm} from "../../types/profile.ts";

interface ProfileEditProps {
    form: UseFormReturnType<ProfileUpdateForm>;
    setPreviewUrl: (previewUrl: string | null) => void;
}

const ProfilePictureChangeButton = ({form, setPreviewUrl}: ProfileEditProps) => {

    return (
        <FileButton
            onChange={file => {
                form.setFieldValue("picture", file);

                if (file) {
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                } else {
                    setPreviewUrl(null);
                }
            }}
            accept="image/png,image/jpeg,image/gif"
            data-testid="profile-picture-button"
        >
            {(props) => (
                <Button {...props} size="xs" variant="light" data-testid="change-picture-button">
                    Change Picture
                </Button>
            )}
        </FileButton>

    );
};

export default ProfilePictureChangeButton;
