import {Button, Group, NumberInput, TextInput} from "@mantine/core";
import type {Team} from "../../types/team.ts";

interface TeamScoreProps {
    team: Team
    score: number
    updateScore: (score: number) => void
}

const TeamScore = ({ team, score, updateScore }: TeamScoreProps) => {

    const updateScoreBy = (amount: number)=> {
        return () => updateScore(score + amount)
    }

    return (
        <Group justify="center" mt="md">
            <TextInput value={team.name} />
            <NumberInput
                min={0}
                step={1}
                value={score}
                onChange={(newScore) => updateScore(newScore as number)}
            />
            <Button onClick={updateScoreBy(6)}>Touchdown</Button>
            <Button onClick={updateScoreBy(3)}>Field Goal</Button>
        </Group>
    );
};

export default TeamScore;
