import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, expect, vi} from "vitest";
import {mockPlayer, renderWithWrap} from "../../../../vitest.setup.tsx";
import * as matchesRequest from "../../../main/request/players.ts";
import PlayerSelectModal from "../../../main/components/profile/PlayerSelectModal.tsx";
import {type PlayerFilter, searchPlayers} from "../../../main/request/players.ts";
import * as mantineForm from "@mantine/form";


let mockProps: {
    opened: boolean;
    onClose: () => void;
    title?: string;
    confirmLabel?: string;
    filter?: PlayerFilter;
    onConfirm: (playerId: number) => Promise<void> | void;
    errorMessage: string;
}

vi.mock("../../../main/request/teams.ts", () => ({
    invitePlayerFromTeam: vi.fn(),
    searchPlayers: vi.fn(),
}));

vi.mock("@mantine/form", () => ({
    useForm: vi.fn().mockReturnValue({
        values: {
            playerId: "1"
        },
        getInputProps: vi.fn(),
        reset: vi.fn(),
        onSubmit: (submitHandler: any) => (_: any) => {
            return submitHandler();
        },
    } as any),
}));


describe("PlayerSelectModal", () => {

    beforeEach(() => {
        mockProps = {
            opened: true,
            onClose: vi.fn(),
            title: "",
            confirmLabel: "",
            filter: {
                isOrphan: false
            },
            onConfirm: vi.fn(),
            errorMessage: "oops"
        }

        vi.clearAllMocks();
    })

    test("renders", () => {

        renderWithWrap(<PlayerSelectModal {...mockProps} />)

        expect(screen.getByTestId("player-selector-modal")).toBeInTheDocument();
    });

    test("Searching player success", async () => {

        vi.spyOn(matchesRequest, "searchPlayers")
            .mockResolvedValue([mockPlayer]);

        renderWithWrap(<PlayerSelectModal {...mockProps} />)

        fireEvent.submit(screen.getByTestId("player-select-submit-form"))

        await waitFor(() => {
            expect(searchPlayers).toBeCalled();
            expect(mockProps.onConfirm).toBeCalled();
        })
    });

    test("Searching player failure", async () => {
        vi.spyOn(mantineForm, "useForm").mockReturnValue({
            values: { playerId: "" },
            getInputProps: vi.fn(),
            reset: vi.fn(),
            onSubmit: (submitHandler: any) => (_: any) => submitHandler(),
        } as any);

        vi.spyOn(matchesRequest, "searchPlayers")
            .mockResolvedValue([mockPlayer]);

        renderWithWrap(<PlayerSelectModal {...mockProps} />)

        fireEvent.submit(screen.getByTestId("player-select-submit-form"))

        await waitFor(() => {
            expect(searchPlayers).toBeCalled();
            expect(mockProps.onConfirm).not.toBeCalled();
        })
    });
});
