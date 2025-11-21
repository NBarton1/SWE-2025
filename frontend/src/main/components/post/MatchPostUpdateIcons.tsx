import {IconTrash} from "@tabler/icons-react";
import {ActionIcon, Stack} from "@mantine/core";
import {Match} from "../../types/match.ts";
import {deleteMatch} from "../../request/matches.ts";
import React, {type Dispatch} from "react";
import type {Post} from "../../types/post.ts";


interface MatchPostUpdateIconsProps {
    match: Match,
    setPosts: Dispatch<React.SetStateAction<Post[]>>
}

const MatchPostUpdateIcons = ({ match, setPosts }: MatchPostUpdateIconsProps) => {

    const handleDelete = async() => {
        try {
            await deleteMatch(match.getId());

            setPosts(prev => prev.filter(curr => curr.match?.id !== match.getId()));
        } catch (error) {
            console.log("Failed to delete match", error);
        }
    }

    return (
        <Stack>
            <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
                <IconTrash />
            </ActionIcon>
        </Stack>
    );
};

export default MatchPostUpdateIcons;
