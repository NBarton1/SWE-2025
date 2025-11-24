import {beforeEach, describe, expect, test, vi} from "vitest";
import {mockAdminAccount, mockFlaggedPosts, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import AdminFlaggedPosts from "../../../main/components/admin/AdminFlaggedPosts.tsx";
import * as posts from "../../../main/request/posts.ts";

vi.mock("../../../main/request/posts.ts", () => {
    return {
        getFlaggedPosts: vi.fn()
    };
})

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockAdminAccount,
        setCurrentAccount: vi.fn()
    })
}));

vi.mock("../../../main/components/post/PostContainer.tsx", () => ({
    default: () => <div data-testid="post-container"/>
}));

describe("AdminFlaggedPosts", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders", async () => {
        vi.spyOn(posts, "getFlaggedPosts").mockResolvedValue([]);

        renderWithWrap(<AdminFlaggedPosts />)

        await waitFor(() => {
            expect(screen.getByTestId("flagged-posts")).toBeInTheDocument();
        })
    })

    test("some flagged posts", async () => {
        vi.spyOn(posts, "getFlaggedPosts").mockResolvedValue(mockFlaggedPosts);

        renderWithWrap(<AdminFlaggedPosts />)

        await waitFor(() => {
            expect(screen.queryByTestId("no-flagged-posts-indicator")).not.toBeInTheDocument();
            const postContainers = screen.getAllByTestId("post-container");
            expect(postContainers).toHaveLength(mockFlaggedPosts.length);
        })
    })

    test("no flagged posts", async () => {
        vi.spyOn(posts, "getFlaggedPosts").mockResolvedValue([]);

        renderWithWrap(<AdminFlaggedPosts />)

        await waitFor(() => {
            expect(screen.getByTestId("no-flagged-posts-indicator")).toBeInTheDocument();
            expect(screen.queryByTestId("post-container")).not.toBeInTheDocument();
        })
    })
})
