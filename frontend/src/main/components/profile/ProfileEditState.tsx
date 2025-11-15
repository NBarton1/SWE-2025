import React from "react";
import {ProfileStateHandler} from "./ProfileStateHandler.tsx";
import ProfilePictureChangeButton from "./ProfilePictureChangeButton.tsx";
import {Button, Group, PasswordInput, Select, Stack, TextInput} from "@mantine/core";
import type {UseFormReturnType} from "@mantine/form";
import type {ProfileUpdateForm} from "../../types/profile.ts";
import {type Account, isAdmin, isPlayer, Role} from "../../types/accountTypes.ts";
import ProfileBadge from "./ProfileBadge.tsx";


export class ProfileEditState extends ProfileStateHandler {

    pictureUploadOption(form: UseFormReturnType<ProfileUpdateForm>, setPreviewUrl: (previewUrl: string | null) => void): React.ReactNode {
        return (
            <ProfilePictureChangeButton form={form} setPreviewUrl={setPreviewUrl} />
        );
    }

    accountNamesFields(form: UseFormReturnType<ProfileUpdateForm>, _account: Account): React.ReactNode {
        return (
            <>
                <TextInput
                    label="Name"
                    placeholder="Name"
                    maxLength={32}
                    required
                    {...form.getInputProps("name")}
                    data-testid="form-name"
                />
                <TextInput
                    label="Username"
                    placeholder="Username"
                    maxLength={32}
                    required
                    {...form.getInputProps("username")}
                    data-testid="form-username"
                />
            </>
        )
    }

    roleOptions(form: UseFormReturnType<ProfileUpdateForm>, currentAccount: Account | null, account: Account): React.ReactNode {
        return (currentAccount && !isAdmin(currentAccount)) ? (
                <ProfileBadge account={account} />
            ) : (
                <Select
                    defaultValue={account.role}
                    data={Object.values(Role)}
                    searchable
                    {...form.getInputProps("role")}
                    data-testid="form-role-select"
                />
            )
    }

    editOptions(_edit: () => void, cancel: () => void): React.ReactNode {
        return (
            <Group gap="xs">
                <Button
                    variant="light"
                    color="green"
                    size="sm"
                    type="submit"
                    data-testid="save-button"
                >
                    Save
                </Button>

                <Button
                    variant="light"
                    color="red"
                    size="sm"
                    onClick={cancel}
                    data-testid="cancel-button"
                >
                    Cancel
                </Button>
            </Group>
        )
    }

    accountDetailsOptions(form: UseFormReturnType<ProfileUpdateForm>, currentAccount: Account | null, handleDelete: () => void): React.ReactNode {
        return (
            <Group align="flex-start">
                <Stack style={{flex: 1}}>
                    {!isPlayer(currentAccount) &&
                        <TextInput
                            label="Email"
                            size="sm"
                            placeholder="user@example.com"
                            {...form.getInputProps("email")}
                            data-testid="form-email"
                        />
                    }
                    <PasswordInput
                        label="Password"
                        size="sm"
                        placeholder="Leave blank to keep current"
                        {...form.getInputProps("password")}
                        data-testid="form-password"
                    />
                    <PasswordInput
                        label="Confirm Password"
                        size="sm"
                        placeholder="Confirm new password"
                        {...form.getInputProps("confirmPassword")}
                        data-testid="form-confirm-password"
                    />
                    <Button
                        onClick={handleDelete}
                        color="red"
                        variant="filled"
                        data-testid="delete-account-button"
                    >
                        Delete Account
                    </Button>
                </Stack>
            </Group>
        )
    }
}
