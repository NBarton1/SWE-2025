import {Select, type SelectProps} from "@mantine/core";

interface MatchTimeInputProps {
    label: string
    teams: { value: string, label: string }[]
    props: SelectProps
}

const MatchTeamSelect = ({ label, teams, props } : MatchTimeInputProps) => {
    return (
        <Select
            label={label}
            placeholder={`Select ${label}`}
            data={teams}
            searchable
            required
            {...props}
        />
    );
};

export default MatchTeamSelect;
