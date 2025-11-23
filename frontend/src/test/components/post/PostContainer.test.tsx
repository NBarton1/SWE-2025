import { vi, describe, test, beforeEach, expect } from "vitest";
import {
    mockAdminAccount,
    mockPlayerAccount,
    mockPost,
    mockPostsWithMatch,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import { screen, waitFor } from "@testing-library/react";
import PostContainer from "../../../main/components/post/PostContainer.tsx";
import type {Post} from "../../../main/types/post.ts";
import React, {type Dispatch} from "react";
import userEvent from "@testing-library/user-event";
import * as useAuth from "../../../main/hooks/useAuth.tsx";

let mockProps: {
    post: Post
    setPosts: Dispatch<React.SetStateAction<Post[]>>
}

vi.mock("../../../main/components/post/PostView.tsx", () => ({
    default: () => null
}));

vi.mock("../../../main/request/posts.ts", () => ({
    getChildren: vi.fn().mockResolvedValue(mockPostsWithMatch),
    deletePost: vi.fn(),
}));

vi.mock("../../../main/request/likes.ts", () => ({
    default: vi.fn().mockResolvedValue(null)
}));

vi.mock("../../../main/hooks/useLikes.tsx", () => ({
    default: vi.fn()
}));


vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockAdminAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("PostContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
         mockProps = {
             post: mockPost,
             setPosts: vi.fn()
         }
    });

    test("renders post container", async () => {
        renderWithWrap(<PostContainer {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-container")).toBeInTheDocument();
        });
    });

    test("deleting post", async () => {

        renderWithWrap(<PostContainer {...mockProps} />);

        const user = userEvent.setup();
        const deleteIcon = await screen.findByTestId("post-delete-icon");
        await user.click(deleteIcon);
    });

    test("deleting post", async () => {
        vi.spyOn(useAuth, "useAuth").mockReturnValue({
            currentAccount: mockPlayerAccount,
            setCurrentAccount: vi.fn()
        })

        renderWithWrap(<PostContainer {...mockProps} />);

        await waitFor(() => {
            expect(screen.queryByTestId("post-delete-icon")).not.toBeInTheDocument();
        })
    });
});
