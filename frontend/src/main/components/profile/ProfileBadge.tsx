import {
    Badge,
} from '@mantine/core';
import type {Account} from '../../types/accountTypes';

interface ProfileBadgeProps {
    account: Account;
}

const ProfileBadge = ({account}: ProfileBadgeProps) => {

    return (
        <Badge variant="light" data-testid="account-role">
            {account.role}
        </Badge>
    );
};

export default ProfileBadge;
