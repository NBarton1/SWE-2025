import { useEffect, useState } from 'react';
import {Container} from '@mantine/core';
import '@mantine/core/styles.css';
import {type Account, accountEquals, isPlayer} from "../../types/accountTypes.ts";
import {useParams} from "react-router";
import {getAccount} from "../../request/accounts.ts";
import useLogin from "../../hooks/useLogin.tsx";
import ProfileHeader from "./ProfileHeader.tsx";
import TeamInvitesTable from "./TeamInvitesTable.tsx";
import DependentsTable from "./DependentsTable.tsx";

const ProfilePage = () => {
    const { id } = useParams();
    const { currentAccount } = useLogin();

    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
        const id_num = Number(id);
        if (isNaN(id_num)) return;
        getAccount(id_num).then(account => {
            setAccount(account);
        });
    }, [id]);

    return (
        <Container size="md" py={40}>
            <ProfileHeader account={account} currentAccount={currentAccount} setAccount={setAccount} />

            {accountEquals(currentAccount, account) && (
                isPlayer(account) ? (
                    <TeamInvitesTable account={account} />
                ) : (
                    <DependentsTable account={account} />
                )
            )}
        </Container>
    );
};

export default ProfilePage;
