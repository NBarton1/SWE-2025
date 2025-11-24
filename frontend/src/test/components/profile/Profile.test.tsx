import {beforeEach, expect, vi} from "vitest";
import {mockPlayerAccount, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import Profile from "../../../main/components/profile/Profile.tsx";


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

vi.mock("../../../main/hooks/useAuth.tsx", () => ({
    useAuth: vi.fn().mockReturnValue({
        currentAccount: mockPlayerAccount,
        setCurrentAccount: vi.fn()
    })
}));

describe("Profile", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders page for player", async () => {

        renderWithWrap(<Profile />)

        await waitFor(() => {
            expect(screen.getByTestId("profile-page-container")).toBeInTheDocument();
        })
    });
});
