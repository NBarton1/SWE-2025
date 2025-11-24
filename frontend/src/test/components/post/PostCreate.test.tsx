import { vi, describe, test, beforeEach, expect } from "vitest";
import {
    mockAdminAccount, mockPost,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import type {Post} from "../../../main/types/post.ts";
import React from "react";
import PostCreate from "../../../main/components/post/PostCreate.tsx";
import userEvent from "@testing-library/user-event";
import {createPost} from "../../../main/request/posts.ts";


let mockProps: {
    setPosts:  React.Dispatch<React.SetStateAction<Post[]>>;
    parent?: Post;
    popup?: boolean;
    clearFormOnSubmit?: boolean;
}

vi.mock("../../../main/request/posts.ts", () => ({
    createPost: vi.fn().mockResolvedValue(mockPost)
}));

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockAdminAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("PostCreate", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            setPosts: vi.fn()
        }
    });

    test("renders", async () => {
        renderWithWrap(<PostCreate {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-create")).toBeInTheDocument();
        });
    });

    test("create post button triggers request", async () => {
        renderWithWrap(<PostCreate {...mockProps} />);

        const user = userEvent.setup();
        const createButton = await screen.findByTestId("create-post-button");
        await user.click(createButton);

        await waitFor(() => {
            expect(createPost).toBeCalled();
        })
    });
});
