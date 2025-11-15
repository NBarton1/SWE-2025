import React from "react";
import type {UseFormReturnType} from "@mantine/form";
import type {ProfileUpdateForm} from "../../types/profile.ts";
import type {Account} from "../../types/accountTypes.ts";

export abstract class ProfileStateHandler {

    abstract validateName(name: string): string | null

    abstract validateUsername(name: string): string | null

    abstract pictureUploadOption(
        form: UseFormReturnType<ProfileUpdateForm>,
        setPreviewUrl: (previewUrl: string | null) => void
    ): React.ReactNode;

    abstract accountNamesFields(
        form: UseFormReturnType<ProfileUpdateForm>,
        account: Account
    ): React.ReactNode

    abstract roleOptions(
        form: UseFormReturnType<ProfileUpdateForm>,
        currentAccount: Account | null,
        account: Account
    ): React.ReactNode

    abstract editOptions(
        edit: () => void,
        cancel: () => void
    ): React.ReactNode;

    abstract accountDetailsOptions(
        form: UseFormReturnType<ProfileUpdateForm>,
        account: Account | null,
        handleDelete: () => void
    ): React.ReactNode;
}
