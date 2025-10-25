import {screen} from "@testing-library/react";
import {beforeEach} from "vitest";
import {renderWithWrap} from "../../vitest.setup.tsx";
import TeamsPage from "../main/TeamsPage.tsx";

describe("TeamsPage", () => {

    beforeEach(() => {
        renderWithWrap(<TeamsPage/>)
    })

    test("renders", () => {

        expect(screen.getByTestId("teams-title")).toBeInTheDocument();
        expect(screen.getByTestId("teams-table")).toBeInTheDocument();
    });
});