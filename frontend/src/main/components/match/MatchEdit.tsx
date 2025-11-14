import { Divider, Paper, Stack } from "@mantine/core";
import {Match} from "../../types/match.ts";
import { type UpdateMatchRequest } from "../../request/matches.ts";
import MatchTitle from "./MatchTitle.tsx";

interface MatchEditProps {
    match: Match;
    updateMatch: (req: UpdateMatchRequest) => void;
}

const MatchEdit = ({ match, updateMatch }: MatchEditProps) => {

    return (
        <Paper
            data-testid="live-match-edit"
            shadow="sm"
            p="md"
            radius="md"
            withBorder
        >
            <Stack gap="md">
                <MatchTitle match={match} />

                <Divider labelPosition="center" />

                {match.getEditControls(updateMatch)}
            </Stack>
        </Paper>
    );
};

export default MatchEdit;
