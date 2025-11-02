import {Button, Group, NumberInput, TextInput} from "@mantine/core";


const TeamScore = () => {

    return (
        <Group justify="center" mt="md">
            <TextInput value={"Team A"} />
            <NumberInput
                placeholder="Enter score"
                min={0}
                step={1}
                defaultValue={0}
            />
            <Button type="submit">
                Touchdown
            </Button>

        </Group>
    );
};

export default TeamScore;
