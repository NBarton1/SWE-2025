import {IconTrash} from "@tabler/icons-react";
import {ActionIcon} from "@mantine/core";
import {Match} from "../../types/match.ts";
import {deleteMatch} from "../../request/matches.ts";
import React, {type Dispatch} from "react";
import {useNavigate} from "react-router";

interface MatchDeleteProps {
    match: Match,
    matches: Match[]
    setMatches: Dispatch<React.SetStateAction<Match[]>>
}

const MatchDelete = ({ match, matches, setMatches }: MatchDeleteProps) => {
    const navigate = useNavigate();

    const handleDelete = async() => {
        try {
            await deleteMatch(match.getId());

            setMatches([...matches.filter(curr => curr.getId() !== match.getId())]);
            navigate("/calendar")
        } catch (error) {
            console.log("Failed to delete match", error);
        }
    }

    return (
        <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
            <IconTrash/>
        </ActionIcon>
    );
};

export default MatchDelete;
