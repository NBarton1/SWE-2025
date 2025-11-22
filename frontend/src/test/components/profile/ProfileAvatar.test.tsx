import {screen, waitFor} from "@testing-library/react";
import {describe, test, beforeEach, vi, expect} from "vitest";
import {mockPlayerAccount, renderWithWrap} from "../../../../vitest.setup.tsx";
import type {Account} from "../../../main/types/accountTypes.ts";
import ProfileAvatar from "../../../main/components/profile/ProfileAvatar.tsx";


let mockProps: {
    account: Account;
    previewUrl?: string | null;
    size?: number
}

describe("ProfileAvatar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders with picture", async () => {
        mockProps = {
            account: mockPlayerAccount,
            previewUrl: "testUrl",
            size: 1
        }

        renderWithWrap(<ProfileAvatar {...mockProps} />);

        const avatar = screen.getByTestId("profile-avatar");
        const img = avatar.querySelector("img");

        expect(avatar).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "testUrl");
    });

    test("renders with no picture", async () => {
        mockProps = {
            account: mockPlayerAccount,
            previewUrl: null,
            size: 0
        }

        renderWithWrap(<ProfileAvatar {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId(`profile-avatar`)).toBeInTheDocument();
            expect(screen.getByTestId(`profile-avatar`)).not.toHaveAttribute("src");
        });
    });
});
