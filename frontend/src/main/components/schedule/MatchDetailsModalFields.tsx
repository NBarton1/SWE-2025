import {Title} from "@mantine/core";
import {Match} from "../../types/match.ts";
import React, {type Dispatch} from "react";
import MatchDetailsForm from "../schedule/MatchDetailsForm.tsx";
import type {Team} from "../../types/team.ts";

interface MatchDeleteProps {
    match: Match | null,
    matches: Match[]
    setMatches: Dispatch<React.SetStateAction<Match[]>>
    teams: Team[]
}

const MatchDetailsModalFields = ({ match, matches, setMatches, teams }: MatchDeleteProps) => {

    return match && (
        <>
            <Title
                order={2}
                mb="md"
                ta="center"
            >
                Match Details
            </Title>

            <MatchDetailsForm
                match={match}
                teams={teams}
                matches={matches}
                setMatches={setMatches}
            />
        </>
    );
};

export default MatchDetailsModalFields;
