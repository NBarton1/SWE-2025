import {
    Avatar,
} from '@mantine/core';
import type {Account} from '../../types/accountTypes';

interface ProfileViewProps {
    account: Account;
    previewUrl?: string | null;
    size?: number
}

const ProfileAvatar = ({account, previewUrl, size}: ProfileViewProps) => {

    return (
        <Avatar
            src={previewUrl ?? account?.picture?.downloadUrl}
            size={size}
            radius="md"
            name={account.name}
            data-testid="profile-avatar"
        />
    );
};

export default ProfileAvatar;
