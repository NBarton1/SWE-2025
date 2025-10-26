import {TimeInput, type TimeInputProps} from "@mantine/dates";


const MatchTimeInput = (props: TimeInputProps) => {
    return (
        <TimeInput
            label="Pick time"
            placeholder="Pick time"
            {...props}
        />
    );
};

export default MatchTimeInput;
