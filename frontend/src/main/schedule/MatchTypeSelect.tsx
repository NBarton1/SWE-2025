import {Select, type SelectProps} from "@mantine/core";
import { MatchType } from "./match.ts";


const MatchTypeSelect = ( props: SelectProps) => {
    const matchTypeOptions = [
        { value: MatchType.STANDARD, label: MatchType.STANDARD },
        { value: MatchType.PLAYOFF, label: MatchType.PLAYOFF }
    ];

    return (
        <Select
            label="Match Type"
            placeholder="Select Match Type"
            data={matchTypeOptions}
            required
            {...props}
        />
    );
};

export default MatchTypeSelect;
