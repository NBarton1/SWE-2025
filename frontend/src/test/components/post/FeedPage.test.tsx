import { vi, describe, test, beforeEach, expect } from "vitest";
import {mockPlayerAccount, mockPosts, renderWithWrap} from "../../../../vitest.setup.tsx";
import { screen, waitFor } from "@testing-library/react";
import FeedPage from "../../../main/components/post/FeedPage.tsx";

vi.mock("../../../main/request/posts.ts", () => ({
    getAllPosts: vi.fn().mockResolvedValue(mockPosts)
}));

vi.mock("../../../main/components/post/PostContainer.tsx", () => ({
    default: () => null
}));

vi.mock("../../../main/components/post/PostApprovalContainer.tsx", () => ({
    default: () => null
}));

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockPlayerAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("FeedPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders feed page", async () => {
        renderWithWrap(<FeedPage />);

        await waitFor(() => {
            expect(screen.getByTestId("feed-page")).toBeInTheDocument();
        });
    });
});
