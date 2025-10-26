import {describe, expect} from "vitest";
import {renderWithWrap} from "../../vitest.setup.tsx";
import Layout from "../main/components/layout/Layout.tsx";
import {screen} from "@testing-library/react";


describe("Layout", () => {

    test("renders", () => {
        renderWithWrap(
            <Layout/>
        )
        expect(screen.getByTestId("layout-appshell")).toBeInTheDocument();
        // Content to be surrounded by the shell should be in the document
        expect(screen.getByTestId("outlet")).toBeInTheDocument();
    })
})