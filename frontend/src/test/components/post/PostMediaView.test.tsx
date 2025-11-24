import { vi, describe, test, beforeEach, expect } from "vitest";
import {
    mockContent, mockVideoContent,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import type {Content} from "../../../main/types/content.ts";
import PostMediaView from "../../../main/components/post/PostMediaView.tsx";


let mockProps: {
    content: Content
}

describe("PostMediaView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders media image", async () => {
        mockProps = {
            content: mockContent
        }

        renderWithWrap(<PostMediaView {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-media-view-image")).toBeInTheDocument();
        });
    });

    test("renders media video", async () => {
        mockProps = {
            content: mockVideoContent
        }

        renderWithWrap(<PostMediaView {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-media-view-video")).toBeInTheDocument();
        });
    });
});
