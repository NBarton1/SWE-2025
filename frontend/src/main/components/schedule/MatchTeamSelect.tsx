import {Select, type SelectProps} from "@mantine/core";

interface MatchTimeInputProps {
    label: string
    teams: { value: string, label: string }[]
    props: SelectProps
    readOnly: boolean
}

const MatchTeamSelect = ({ label, teams, props, readOnly } : MatchTimeInputProps) => {
    return (
        <Select
            label={label}
            placeholder={`Select ${label}`}
            data={teams}
            searchable
            readOnly={readOnly}
            required={!readOnly}
            {...props}
        />
    );
};

export default MatchTeamSelect;
