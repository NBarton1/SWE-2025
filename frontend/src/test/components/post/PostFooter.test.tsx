import { vi, describe, test, beforeEach, expect } from "vitest";
import {
    mockAdminAccount,
    mockPost,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import PostFooter from "../../../main/components/post/PostFooter.tsx";
import type {Post} from "../../../main/types/post.ts";
import React from "react";


let mockProps: {
    post: Post,
    commentsOpen: boolean,
    setCommentsOpen:  React.Dispatch<React.SetStateAction<boolean>>
}

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockAdminAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("PostFooter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("test comments opened", async () => {
        mockProps = {
            post: mockPost,
            commentsOpen: true,
            setCommentsOpen: vi.fn()
        }

        renderWithWrap(<PostFooter {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-footer")).toBeInTheDocument();
            expect(screen.getByTestId("comments-open-indicator")).toBeInTheDocument();
        });
    });

    test("test comments collapsed", async () => {
        mockProps = {
            post: mockPost,
            commentsOpen: false,
            setCommentsOpen: vi.fn()
        }

        renderWithWrap(<PostFooter {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-footer")).toBeInTheDocument();
            expect(screen.getByTestId("comments-collapsed-indicator")).toBeInTheDocument();
        });
    });
});
