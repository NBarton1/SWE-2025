import {DatePickerInput, type DatePickerInputProps} from "@mantine/dates";
import '@mantine/dates/styles.css';


const MatchDateSelect = (props: DatePickerInputProps) => {
    return (
        <>
            <style>{`
                .mantine-DatePickerInput-day[data-weekend] {
                    color: inherit !important;
                }
            `}
            </style>

            <DatePickerInput
                label="Date"
                placeholder="Select date"
                {...props}
            />
        </>

    );
};

export default MatchDateSelect;
