import {beforeEach, describe, expect, vi} from "vitest";
import {mockAdminAccount, mockPlayerAccount, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import AdminAccountsPage from "../../../main/components/admin/AdminAccountsPage.tsx";


vi.mock("../../../main/request/accounts.ts", () => {
    return {
        getAccounts: vi.fn().mockResolvedValue([mockAdminAccount, mockPlayerAccount]),
    };
})

describe("AdminAccountsPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders", async () => {
        renderWithWrap(<AdminAccountsPage/>)

        await waitFor(() => {
            expect(screen.getByTestId("admin-accounts-page-table")).toBeInTheDocument();
        })
    })
})
