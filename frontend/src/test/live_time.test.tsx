import {vi} from "vitest";
import {mockLiveTimeStoppedMatch} from "../../vitest.setup.tsx";
import {updateLiveTime} from "../main/components/live_match/live_time.ts";


describe("LiveMatchClockEdit", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    test('interval runs and counts down time', () => {
        mockLiveTimeStoppedMatch.timeRunning = true;

        let initial_time = mockLiveTimeStoppedMatch.clockTimestamp
        let currentTime = initial_time;

        const setTimeLeft = vi.fn((updater) => {
            if (typeof updater === 'function') {
                currentTime = updater(currentTime);
            } else {
                currentTime = updater;
            }
        });

        updateLiveTime(mockLiveTimeStoppedMatch, setTimeLeft);

        expect(setTimeLeft).toHaveBeenCalledWith(currentTime);
        expect(currentTime).toBe(initial_time);

        vi.advanceTimersByTime(1000);
        expect(currentTime).toBe(initial_time - 1);

        vi.advanceTimersByTime(2000);
        expect(currentTime).toBe(initial_time - 3);

        expect(setTimeLeft).toHaveBeenCalledTimes(4);
    });
});
