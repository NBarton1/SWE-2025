import {TimeInput, type TimeInputProps} from "@mantine/dates";


const MatchTimeInput = (props: TimeInputProps) => {
    return (
        <TimeInput
            label="Time"
            placeholder="Pick time"
            required
            {...props}
        />
    );
};

export default MatchTimeInput;
