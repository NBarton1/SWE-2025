import type {Team} from "../../types/team.ts";
import {Group, Text} from "@mantine/core";

interface TeamScoreViewProps {
    team: Team
    score: number
}

const TeamScoreView = ({ team, score }: TeamScoreViewProps) => {

    return (
        <Group justify="space-between" align="center" p="xs">
            <Text fz="lg">
                {team.name}
            </Text>
            <Text fz="xl">
                {score}
            </Text>
        </Group>
    );
};

export default TeamScoreView;
