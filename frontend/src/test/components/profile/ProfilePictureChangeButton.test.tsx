import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { UseFormReturnType } from '@mantine/form';
import ProfilePictureChangeButton from "../../../main/components/profile/ProfilePictureChangeButton.tsx";
import type {ProfileUpdateForm} from "../../../main/types/profile.ts";
import {renderWithWrap} from "../../../../vitest.setup.tsx";


describe("ProfilePictureChangeButton", () => {
    let mockForm: UseFormReturnType<ProfileUpdateForm>;
    let mockSetPreviewUrl: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockSetPreviewUrl = vi.fn();

        mockForm = {
            values: {
                picture: null
            },
            setFieldValue: vi.fn(),
        } as unknown as UseFormReturnType<ProfileUpdateForm>;

        global.URL.createObjectURL = vi.fn(() => "testUrl");
        global.URL.revokeObjectURL = vi.fn();
    });

    test("renders change picture button", () => {
        renderWithWrap(
            <ProfilePictureChangeButton
                form={mockForm}
                setPreviewUrl={mockSetPreviewUrl}
            />
        );

        expect(screen.getByTestId('change-picture-button')).toBeInTheDocument();
        expect(screen.getByText('Change Picture')).toBeInTheDocument();
    });

    test("handles profile picture selection", async () => {
        renderWithWrap(
            <ProfilePictureChangeButton
                form={mockForm}
                setPreviewUrl={mockSetPreviewUrl}
            />
        );

        const file = new File(["test content"], 'test.png', { type: 'image/png' });
        const button = screen.getByTestId("change-picture-button");
        const input = button.closest("button")?.previousElementSibling as HTMLInputElement;

        await userEvent.upload(input || button, file);

        expect(mockForm.setFieldValue).toHaveBeenCalledWith("picture", file);
        expect(mockSetPreviewUrl).toHaveBeenCalledWith("testUrl");
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
});