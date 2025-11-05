import type {Match} from "../../types/match.ts";


export const updateLiveTime = (match: Match, setTimeLeft: (value: React.SetStateAction<number>) => void) => {
    setTimeLeft(match.clockTimestamp);

    if (!match.timeRunning) {
        return;
    }

    const interval = setInterval(() => {
        setTimeLeft(prevTime => {
            if (prevTime <= 1) {
                clearInterval(interval);
                return 0;
            }
            return prevTime - 1
        });
    }, 1000);

    return () => clearInterval(interval);
}