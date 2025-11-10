import type {Team} from "../../types/team.ts";
import {Group, Text} from "@mantine/core";

interface TeamScoreViewProps {
    team: Team
    score: number
}

const TeamScoreView = ({ team, score }: TeamScoreViewProps) => {

    return (
        <Group
            data-testid="team-score-view"
            justify="space-between" align="center" p="xs"
        >
            <Text
                data-testid="team-name"
                fz="lg"
            >
                {team.name}
            </Text>
            <Text
                data-testid="team-score"
                fz="xl"
            >
                {score}
            </Text>
        </Group>
    );
};

export default TeamScoreView;
