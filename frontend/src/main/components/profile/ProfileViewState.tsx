import React from "react";
import {ProfileStateHandler} from "./ProfileStateHandler.tsx";
import type {UseFormReturnType} from "@mantine/form";
import type {ProfileUpdateForm} from "../../types/profile.ts";
import {Button, Text} from "@mantine/core";
import type {Account} from "../../types/accountTypes.ts";
import ProfileBadge from "./ProfileBadge.tsx";


export class ProfileViewState extends ProfileStateHandler {

    validateName(_name: string) {
        return null
    }

    validateUsername(_username: string): string | null {
        return null
    }

    pictureUploadOption(
        _form: UseFormReturnType<ProfileUpdateForm>,
        _setPreviewUrl: (previewUrl: string | null) => void
    ): React.ReactNode {

        return null;
    }

    accountNamesFields(
        _form: UseFormReturnType<ProfileUpdateForm>,
        account: Account
    ): React.ReactNode {

        return (
            <>
                <Text
                    size="xl"
                    fw={700}
                    data-testid="account-name"
                >
                    {account.name}
                </Text>

                <Text
                    size="sm"
                    c="dimmed"
                    data-testid="account-username"
                >
                    @{account.username}
                </Text>

                {account.email &&
                    <Text size="sm" data-testid="account-email">{account.email}</Text>
                }
            </>
        );
    }

    roleOptions(
        _form: UseFormReturnType<ProfileUpdateForm>,
        _currentAccount: Account | null, account: Account
    ): React.ReactNode {

        return (
            <ProfileBadge account={account} />
        );
    }

    editOptions(
        edit: () => void,
        _cancel: () => void
    ): React.ReactNode {

        return (
            <Button
                variant="light"
                size="sm"
                onClick={edit}
                data-testid="edit-profile-button"
            >
                Edit Profile
            </Button>
        )
    }

    accountDetailsOptions(
        _form: UseFormReturnType<ProfileUpdateForm>,
        _account: Account | null,
        _handleDelete: () => void
    ): React.ReactNode {

        return null;
    }
}
