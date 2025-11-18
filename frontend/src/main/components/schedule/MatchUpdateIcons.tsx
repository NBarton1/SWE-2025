import {IconEdit, IconTrash} from "@tabler/icons-react";
import {ActionIcon, Stack} from "@mantine/core";
import {Match} from "../../types/match.ts";
import {deleteMatch} from "../../request/matches.ts";
import React, {type Dispatch} from "react";


interface MatchDeleteProps {
    match: Match,
    setMatch: Dispatch<React.SetStateAction<Match | null>>
    matches: Match[]
    setMatches: Dispatch<React.SetStateAction<Match[]>>
}

const MatchUpdateIcons = ({ match, setMatch, matches, setMatches }: MatchDeleteProps) => {

    const handleDelete = async() => {
        try {
            await deleteMatch(match.getId());

            setMatches([...matches.filter(curr => curr.getId() !== match.getId())]);
        } catch (error) {
            console.log("Failed to delete match", error);
        }
    }

    const handleUpdate = () => {
        setMatch(match);
    }

    return (
        <Stack>
            <ActionIcon variant="subtle" color="red" onClick={handleUpdate}>
                <IconEdit />
            </ActionIcon>

            <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
                <IconTrash />
            </ActionIcon>
        </Stack>
    );
};

export default MatchUpdateIcons;
