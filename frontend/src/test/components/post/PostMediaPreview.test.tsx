import { vi, describe, test, beforeEach, expect } from "vitest";
import {
    mockContentPreview, mockVideoContentPreview,
    renderWithWrap
} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import type {ContentPreview} from "../../../main/types/content.ts";
import PostMediaPreview from "../../../main/components/post/PostMediaPreview.tsx";


let mockProps: {
    contentPreview: ContentPreview
}

describe("PostMediaView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders media image", async () => {
        mockProps = {
            contentPreview: mockContentPreview
        }

        renderWithWrap(<PostMediaPreview {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-media-preview-image")).toBeInTheDocument();
        });
    });

    test("renders media video", async () => {
        mockProps = {
            contentPreview: mockVideoContentPreview
        }

        renderWithWrap(<PostMediaPreview {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByTestId("post-media-preview-video")).toBeInTheDocument();
        });
    });
});
