import {vi} from "vitest";
import {mockLiveTimeRunningMatchResponse} from "../../../../vitest.setup.tsx";
import {updateLiveTime} from "../../../main/components/match/MatchLiveTime.ts";


describe("live_time", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    test("match time counts downwards", () => {

        let initial_time = mockLiveTimeRunningMatchResponse.clockTimestamp
        let currentTime = initial_time;

        const setTimeLeft = vi.fn((updater) => {
            if (typeof updater === 'function') {
                currentTime = updater(currentTime);
            } else {
                currentTime = updater;
            }
        });

        updateLiveTime(mockLiveTimeRunningMatchResponse, setTimeLeft);

        expect(setTimeLeft).toHaveBeenCalledWith(currentTime);
        expect(currentTime).toBe(initial_time);

        vi.advanceTimersByTime(1000);
        expect(currentTime).toBe(initial_time - 1);

        vi.advanceTimersByTime(2000);
        expect(currentTime).toBe(initial_time - 3);

        expect(setTimeLeft).toHaveBeenCalledTimes(4);
    });
});
