import {IconEdit, IconTrash} from "@tabler/icons-react";
import {ActionIcon, Stack} from "@mantine/core";
import {Match} from "../../types/match.ts";
import {deleteMatch} from "../../request/matches.ts";
import React, {type Dispatch} from "react";
import type {Post} from "../../types/post.ts";


interface MatchPostUpdateIconsProps {
    match: Match,
    setPosts: Dispatch<React.SetStateAction<Post[]>>
    setSelectedMatch: Dispatch<React.SetStateAction<Match | null>>
}

const MatchPostUpdateIcons = ({ match, setPosts, setSelectedMatch }: MatchPostUpdateIconsProps) => {

    const handleDelete = async() => {
        console.log("DK just won again")

        try {
            await deleteMatch(match.getId());

            setPosts(prev => prev.filter(curr => {
                if (curr.match?.id !== match.getId()) {
                    console.log("DK won")
                    return true;
                } else {
                    console.log("DK just won")
                    return false;
                }
            }));
        } catch (error) {
            console.log("Failed to delete match", error);
        }
    }

    const handleUpdate = () => {
        setSelectedMatch(match);
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

export default MatchPostUpdateIcons;
