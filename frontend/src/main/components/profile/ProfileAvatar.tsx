import {
    Avatar,
} from '@mantine/core';
import type {Account} from '../../types/accountTypes';

interface ProfileViewProps {
    account: Account;
    previewUrl: string | null;
}

const ProfileAvatar = ({account, previewUrl}: ProfileViewProps) => {

    return (
        <Avatar
            src={previewUrl ?? account?.picture?.downloadUrl}
            size={120}
            radius="md"
            name={account.name}
            data-testid="profile-avatar"
        />
    );
};

export default ProfileAvatar;
