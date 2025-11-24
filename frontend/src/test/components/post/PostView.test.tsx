import { vi, describe, test, beforeEach, expect } from "vitest";
import {
    mockAdminAccount, mockPost, mockPostDeletedAccount,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import type {Post} from "../../../main/types/post.ts";
import PostView from "../../../main/components/post/PostView.tsx";


let mockProps: {
    post: Post
}

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockAdminAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("PostView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders", async () => {
        mockProps = {
            post: mockPost
        }

        renderWithWrap(<PostView {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-view")).toBeInTheDocument();
        });
    });

    test("view for post by active account", async () => {
        mockProps = {
            post: mockPost
        }

        renderWithWrap(<PostView {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-view")).toBeInTheDocument();
            expect(screen.getByTestId("post-author").textContent).toMatch(new RegExp(`@${mockAdminAccount.username}`));
        });
    });

    test("view for post by deleted account", async () => {
        mockProps = {
            post: mockPostDeletedAccount
        }

        renderWithWrap(<PostView {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-view")).toBeInTheDocument();
            expect(screen.getByTestId("post-author").textContent).toMatch(/Deleted User/);
        });
    });
});
