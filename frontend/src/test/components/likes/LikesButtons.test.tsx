import {beforeEach, describe, expect, vi} from "vitest";
import {mockUseLikesReturn, renderWithWrap} from "../../../../vitest.setup.tsx";
import {screen, waitFor} from "@testing-library/react";
import LikesButtons from "../../../main/components/likes/LikesButtons.tsx";
import userEvent from "@testing-library/user-event";

describe("Likes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders", async () => {

        renderWithWrap(<LikesButtons {...mockUseLikesReturn} />)

        await waitFor(() => {
            expect(screen.queryByTestId("like-button")).toBeInTheDocument();
            expect(screen.queryByTestId("dislike-button")).toBeInTheDocument();
        })
    })

    test("like button click", async () => {

        renderWithWrap(<LikesButtons {...mockUseLikesReturn} />)

        let likeButton = await screen.findByTestId("like-button");

        const user = userEvent.setup();
        await user.click(likeButton);

        await waitFor(() => {
            expect(mockUseLikesReturn.handleReact).toBeCalledWith(true);
        })
    })

    test("dislike button click", async () => {

        renderWithWrap(<LikesButtons {...mockUseLikesReturn} />)

        let likeButton = await screen.findByTestId("dislike-button");

        const user = userEvent.setup();
        await user.click(likeButton);

        await waitFor(() => {
            expect(mockUseLikesReturn.handleReact).toBeCalledWith(false);
        })
    })
})
