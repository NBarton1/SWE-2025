import { vi, describe, test, beforeEach, expect } from "vitest";
import {
    mockAdminAccount,
    mockPost,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import { screen, waitFor } from "@testing-library/react";
import type {Post} from "../../../main/types/post.ts";
import PostApprovalContainer from "../../../main/components/post/PostApprovalContainer.tsx";
import userEvent from "@testing-library/user-event";

let mockProps: {
    post: Post;
    onApprove?: (post: Post) => void;
    onDisapprove?: (post: Post) => void;
    hasApprovalText?: boolean
}

global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => true,
} as Response);

const mockOnApprove = vi.fn();
const mockOnDisapprove = vi.fn();

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockAdminAccount,
        setCurrentAccount: vi.fn()
    })
}));

vi.mock("../../../main/components/post/PostView.tsx", () => ({
    default: () => null
}));

describe("PostApprovalContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            post: mockPost,
            onApprove: mockOnApprove,
            onDisapprove: mockOnDisapprove,
            hasApprovalText: true
        }
    });

    test("renders post approval container", async () => {
        renderWithWrap(<PostApprovalContainer {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-approval-container")).toBeInTheDocument();
        });
    });

    test("post approval button", async () => {
        renderWithWrap(<PostApprovalContainer {...mockProps} />);

        const approveButton = await screen.findByTestId("approve-button");

        const user = userEvent.setup();
        await user.click(approveButton);

        await waitFor(() => {
            expect(mockOnApprove).toBeCalled();
        })
    });

    test("post disapprove button", async () => {
        renderWithWrap(<PostApprovalContainer {...mockProps} />);

        const disapproveButton = await screen.findByTestId("disapprove-button");

        const user = userEvent.setup();
        await user.click(disapproveButton);

        await waitFor(() => {
            expect(mockOnDisapprove).toBeCalled();
        })
    });
});
