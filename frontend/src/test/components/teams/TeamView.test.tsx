import {screen} from "@testing-library/react";
import {beforeEach, expect, vi} from "vitest";
import {renderWithWrap} from "../../../../vitest.setup.tsx";
import TeamView from "../../../main/components/teams/TeamView.tsx";
import * as router from "react-router-dom";


vi.spyOn(router, "useParams").mockReturnValue({ id: "1" });

describe("TeamsPage", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test("renders", () => {

        renderWithWrap(<TeamView />)

        expect(screen.getByTestId("team-view")).toBeInTheDocument();
    });
});
