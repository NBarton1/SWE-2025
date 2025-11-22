import {beforeEach, describe, expect, vi} from "vitest";
import {mockUnapprovedContent, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import AdminContentApprovalPage from "../../../main/components/admin/AdminContentApprovalPage.tsx";
import userEvent from "@testing-library/user-event";
import {approveContent, deleteContent} from "../../../main/request/content.ts";


vi.mock("../../../main/request/content.ts", () => {
    return {
        getUnapprovedContent: vi.fn().mockResolvedValue(mockUnapprovedContent),
        approveContent: vi.fn().mockResolvedValue(mockUnapprovedContent),
        deleteContent: vi.fn(),
    };
})

describe("AdminContentApprovalPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders", async () => {
        renderWithWrap(<AdminContentApprovalPage />)

        await waitFor(() => {
            expect(screen.getByTestId("admin-content-approval-page")).toBeInTheDocument();
            expect(screen.getByTestId("approve-content-button")).toBeInTheDocument();
            expect(screen.getByTestId("disapprove-content-button")).toBeInTheDocument();
        })
    })

    test("test approving content", async () => {
        renderWithWrap(<AdminContentApprovalPage />)

        let approveButton = await screen.findByTestId("approve-content-button");

        const user = userEvent.setup();
        await user.click(approveButton);

        await waitFor(() => {
            expect(approveContent).toHaveBeenCalled();
        })
    })

    test("test disapproving content", async () => {
        renderWithWrap(<AdminContentApprovalPage />)

        let disapproveButton = await screen.findByTestId("disapprove-content-button");

        const user = userEvent.setup();
        await user.click(disapproveButton);

        await waitFor(() => {
            expect(deleteContent).toHaveBeenCalled();
        })
    })
})
