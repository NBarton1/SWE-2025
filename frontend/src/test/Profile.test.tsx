import { describe, test, expect, vi } from "vitest";
import { renderWithWrap } from "../../vitest.setup.tsx";
import ProfilePage from "../main/components/profile/Profile.tsx";
import { screen } from "@testing-library/react";
import * as accountsApi from "../main/request/accounts.ts";
import {Role} from "../main/types/accountTypes.ts";

vi.mock("../../main/hooks/useLogin.tsx", () => ({
    default: () => ({
        currentAccount: { id: 1, role: "ADMIN", name: "Admin" },
    }),
}));

vi.spyOn(accountsApi, "getAccount").mockResolvedValue({
    id: 1,
    name: "Admin",
    username: "admin",
    picture: null,
    email: null,
    role: Role.ADMIN
});

vi.spyOn(accountsApi, "getDependents").mockResolvedValue([
    { account: { id: 2, name: "Child 1", username: "child1", picture: null, email: null, role: Role.PLAYER }, hasPermission: false },
]);

describe("Profile", () => {
    test("renders dependents checkbox", async () => {
        renderWithWrap(<ProfilePage />);
        const checkbox = await screen.findByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
    });
});
