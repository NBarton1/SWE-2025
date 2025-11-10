import {beforeEach, expect, vi} from "vitest";
import {mockPlayerAccount, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import ProfilePage from "../../../main/components/profile/Profile.tsx";


vi.mock("../../../main/request/accounts.ts", () => {
    return {
        getAccount: vi.fn().mockResolvedValue(mockPlayerAccount),
        getDependents: vi.fn().mockResolvedValue([])
    };
})

vi.mock("react-router", async () => {
    return {
        useParams: vi.fn().mockReturnValue({ id: mockPlayerAccount.id }),
        useNavigate: vi.fn()
    };
});

vi.mock("../../../main/hooks/useLogin.tsx", () => {
    return {
        default: vi.fn().mockReturnValue({
            currentAccount: mockPlayerAccount,
        }),
    };
});

describe("Profile", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders page for player", async () => {

        renderWithWrap(<ProfilePage />)

        await waitFor(() => {
            expect(screen.getByTestId("profile-page-container")).toBeInTheDocument();
            expect(screen.getByTestId("team-invites-table")).toBeInTheDocument();
        })
    });
});
