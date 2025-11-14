import {expect, vi} from "vitest";
import { renderWithWrap, mockMatches } from "../../../../vitest.setup.tsx";
import { screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import * as matchRequest from "../../../main/request/matches.ts";
import ScheduleList from "../../../main/components/schedule/ScheduleList.tsx";

describe("ScheduleList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders ScheduleList component", async () => {
        vi.spyOn(matchRequest, "getMatches").mockResolvedValue(mockMatches);

        renderWithWrap(<ScheduleList />);

        await waitFor(() => {
            expect(screen.getByTestId("schedule-paper")).toBeInTheDocument();
            expect(screen.getByTestId("schedule-title")).toHaveTextContent("Schedule");
        });
    });

    test("calls getMatches on mount", async () => {
        const getMatchesSpy = vi.spyOn(matchRequest, "getMatches").mockResolvedValue(mockMatches);

        renderWithWrap(<ScheduleList />);

        await waitFor(() => {
            expect(getMatchesSpy).toHaveBeenCalled();
        });
    });

    test("renders list of matches", async () => {
        vi.spyOn(matchRequest, "getMatches").mockResolvedValue(mockMatches);
        renderWithWrap(<ScheduleList />);

        for (const match of mockMatches) {

            await waitFor(() => {
                expect(screen.getByTestId(`live-match-view-${match.id}`)).toBeInTheDocument();
            })
        }
    });
});
