import {Button, Group, TextInput} from "@mantine/core";


const MatchClock = () => {

    return (
        <Group justify="center" mt="md">
            <TextInput readOnly value={"54:30"} />
            <Button type="submit">
                Start Clock
            </Button>
        </Group>
    );
};

export default MatchClock;
