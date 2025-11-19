import MatchTimeInput from "./MatchTimeInput.tsx";
import MatchTypeSelect from "./MatchTypeSelect.tsx";
import type {UseFormReturnType} from "@mantine/form";
import MatchTeamSelect from "./MatchTeamSelect.tsx";
import MatchDateSelect from "./MatchDateSelect.tsx";

interface MatchFormValues {
    homeTeamId: string
    awayTeamId: string
    time: string
    date: string | null
    type: string
}

interface MatchFormFieldsProps {
    teams: { value: string, label: string }[]
    matchFormFields: UseFormReturnType<MatchFormValues>
    readOnly: boolean
}

const MatchFormFields = ({ teams, matchFormFields, readOnly } : MatchFormFieldsProps) => {
    console.log("Date", matchFormFields.getInputProps("date"))

    return (
        <>
            <MatchTeamSelect
                label="Away Team"
                teams={teams}
                props={matchFormFields.getInputProps("awayTeamId")}
                readOnly={readOnly}
            />

            <MatchTeamSelect
                label="Home Team"
                teams={teams}
                props={matchFormFields.getInputProps("homeTeamId")}
                readOnly={readOnly}
            />

            <MatchTimeInput
                {...matchFormFields.getInputProps('time')}
                readOnly={readOnly}
                required={!readOnly}
            />

            <MatchDateSelect
                {...matchFormFields.getInputProps('date')}
                readOnly={readOnly}
                required={!readOnly}
            />

            <MatchTypeSelect
                {...matchFormFields.getInputProps('type')}
                readOnly={readOnly}
                required={!readOnly}
            />
        </>
    );
};

export default MatchFormFields;
