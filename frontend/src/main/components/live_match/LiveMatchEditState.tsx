import {Group, rem, Select, Text} from "@mantine/core";
import {type Match, MatchState} from "../../types/match.ts";
import type {UpdateMatchRequest} from "../../request/matches.ts";


interface MatchEditStateProps {
    match: Match
    updateLiveMatch: (req: UpdateMatchRequest) => void
}

const MatchEditState = ({ match, updateLiveMatch }: MatchEditStateProps) => {
    const matchStateOptions = [
        { value: MatchState.SCHEDULED, label: MatchState.SCHEDULED },
        { value: MatchState.LIVE, label: MatchState.LIVE },
        { value: MatchState.FINISHED, label: MatchState.FINISHED }
    ];

    return (
        <Group
            data-testid="match-edit-state"
            align="center"
            wrap="nowrap"
        >
            <Text
                data-testid="match-edit-state-label"
                style={{ width: rem(150), flexShrink: 0 }}
                fw={700}
            >
                State
            </Text>

            <Select
                data-testid="match-edit-state-select"
                value={match.state}
                data={matchStateOptions}
                required
                onChange={(state) => {
                    if (state != null) updateLiveMatch({ state });
                }}
            />
        </Group>
    );
};

export default MatchEditState;
