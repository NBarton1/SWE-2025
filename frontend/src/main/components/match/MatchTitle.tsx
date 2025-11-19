import {Match} from "../../types/match.ts";
import { Title } from "@mantine/core";

interface MatchTitleProps {
    match: Match;
}

const MatchTitle = ({ match }: MatchTitleProps) => {
    return (
        <Title
            order={3}
            ta="center"
            data-testid="match-title"
        >
            {match.getTeams()}
            {match.getTitleSuffix()}
        </Title>
    );
};

export default MatchTitle;
