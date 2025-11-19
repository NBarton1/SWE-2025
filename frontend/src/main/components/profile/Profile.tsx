import { useEffect, useState } from 'react';
import {Container, Stack} from '@mantine/core';
import '@mantine/core/styles.css';
import {type Account, accountEquals, isCoach, isPlayer} from "../../types/accountTypes.ts";
import {useParams} from "react-router";
import {getAccount} from "../../request/accounts.ts";
import TeamInvitesTable from "./TeamInvitesTable.tsx";
import DependentsTable from "./DependentsTable.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import ProfileHeader from "./ProfileHeader.tsx";
import Likes from "../likes/Likes.tsx";

const ProfilePage = () => {
    const { id } = useParams();
    const { currentAccount } = useAuth();

    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        const id_num = Number(id);
        if (isNaN(id_num)) return;
        getAccount(id_num).then(account => {
            setAccount(account);
        });
    }, [id]);


    return (
        <Container
            size="md"
            py={40}
            data-testid="profile-page-container"

        >
            <Stack gap="md">
                <ProfileHeader account={account} setAccount={setAccount} />

                {isCoach(account) && (
                    // @ts-expect-error already null safe from isCoach
                    <Likes entityId={account.id} likeType="COACH"/>
                )}

                {accountEquals(currentAccount, account) && (
                    isPlayer(account) ? (
                        <TeamInvitesTable account={account} />
                    ) : (
                        <DependentsTable account={account} />
                    )
                )}
            </Stack>
        </Container>
    );
};

export default ProfilePage;
