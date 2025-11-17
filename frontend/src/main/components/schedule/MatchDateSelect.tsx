import {DatePickerInput, type DatePickerInputProps} from "@mantine/dates";
import '@mantine/dates/styles.css';


const MatchDateSelect = (props: DatePickerInputProps) => {
    return (
        <DatePickerInput
            label="Date"
            placeholder="Select date"
            {...props}
        />
    );
};

export default MatchDateSelect;
