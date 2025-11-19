import {Title} from "@mantine/core";
import {Match} from "../../types/match.ts";
import React, {type Dispatch} from "react";
import MatchDetailsForm from "../schedule/MatchDetailsForm.tsx";
import type {Team} from "../../types/team.ts";

interface MatchDeleteProps {
    match: Match | null,
    setSelectedMatch: Dispatch<React.SetStateAction<Match | null>>
    setMatches: Dispatch<React.SetStateAction<Match[]>>
    teams: Team[]
}

const MatchDetailsModalFields = ({ match, setSelectedMatch, setMatches, teams }: MatchDeleteProps) => {

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
                setSelectedMatch={setSelectedMatch}
                teams={teams}
                setMatches={setMatches}
            />
        </>
    );
};

export default MatchDetailsModalFields;
