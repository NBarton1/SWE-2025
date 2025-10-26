import MatchTimeInput from "./MatchTimeInput.tsx";
import MatchTypeSelect from "./MatchTypeSelect.tsx";
import type {UseFormReturnType} from "@mantine/form";
import MatchTeamSelect from "./MatchTeamSelect.tsx";

interface MatchFormFields {
    homeTeamId: string
    awayTeamId: string
    time: string
    type: string
}

interface MatchTimeInputProps {
    teams: { value: string, label: string }[]
    matchFormFields: UseFormReturnType<MatchFormFields>
}

const MatchFormFields = ({ teams, matchFormFields } : MatchTimeInputProps) => {
    return (
        <>
            <MatchTeamSelect label="Home Team" teams={teams} props={matchFormFields.getInputProps("homeTeamId")} />

            <MatchTeamSelect label="Away Team" teams={teams} props={matchFormFields.getInputProps("awayTeamId")} />

            <MatchTimeInput {...matchFormFields.getInputProps('time')}/>

            <MatchTypeSelect {...matchFormFields.getInputProps('type')} />
        </>
    );
};

export default MatchFormFields;
