import {Button, Group, NumberInput, rem, Text} from "@mantine/core";
import type {Team} from "../../types/team.ts";

interface TeamScoreEditProps {
    team: Team
    score: number
    updateScore: (score: number) => void
}

const TeamScoreEdit = ({ team, score, updateScore }: TeamScoreEditProps) => {
    const updateScoreBy = (amount: number) => () => updateScore(score + amount);

    return (
        <Group align="center" wrap="nowrap">
            <Text style={{ width: rem(150), flexShrink: 0 }} fw={700}>
                {team.name}
            </Text>

            <NumberInput
                min={0}
                value={score}
                onChange={(newScore) => updateScore(newScore as number)}
                style={{ width: rem(80), flexShrink: 0 }}
            />

            <Group gap="xs">
                <Button onClick={updateScoreBy(6)}>Touchdown</Button>
                <Button onClick={updateScoreBy(1)}>Extra Point</Button>
                <Button onClick={updateScoreBy(2)}>2PT</Button>
                <Button onClick={updateScoreBy(3)}>Field Goal</Button>
                <Button onClick={updateScoreBy(2)}>Safety</Button>
            </Group>
        </Group>
    );
};

export default TeamScoreEdit;
