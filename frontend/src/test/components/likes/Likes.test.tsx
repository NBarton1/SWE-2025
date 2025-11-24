import {beforeEach, describe, expect, vi} from "vitest";
import {mockUseLikesReturn, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import Likes from "../../../main/components/likes/Likes.tsx";
import type {LikeType} from "../../../main/types/like.ts";

let mockProps: {
    entityId: number,
    likeType: LikeType
    compact?: boolean
}

vi.mock( "../../../main/hooks/useLikes.tsx", () => {
    return {
        default: vi.fn().mockReturnValue(mockUseLikesReturn),
    };
})


describe("Likes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders compact view", async () => {
        mockProps = {
            entityId: 1,
            likeType: "POST",
            compact: true,
        }

        renderWithWrap(<Likes {...mockProps} />)

        await waitFor(() => {
            expect(screen.queryByTestId("likes-view")).not.toBeInTheDocument();
        })
    })

    test("renders non compact view", async () => {
        mockProps = {
            entityId: 1,
            likeType: "POST",
            compact: false,
        }

        renderWithWrap(<Likes {...mockProps} />)

        await waitFor(() => {
            expect(screen.queryByTestId("likes-view")).toBeInTheDocument();
        })
    })
})
