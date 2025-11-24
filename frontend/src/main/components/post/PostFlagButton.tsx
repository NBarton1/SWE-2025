import {useCallback, useEffect, useState} from "react";
import type {Flag} from "../../types/flag.ts";
import {FlagIcon} from "lucide-react";
import {Button} from "@mantine/core";
import {deleteFlag, flagPost, getFlag, getFlagCountForPost} from "../../request/flags.ts";
import {isAdmin} from "../../types/accountTypes.ts";
import {useAuth} from "../../hooks/useAuth.tsx";

interface PostFlagButtonProps {
    postId: number
}

const PostFlagButton = ({ postId }: PostFlagButtonProps ) => {

    const { currentAccount } = useAuth()

    const [currentFlag, setCurrentFlag] = useState<Flag | null>(null);
    const [numFlags, setNumFlags] = useState(0)

    useEffect(() => {
        getFlagCountForPost(postId).then(setNumFlags)
    }, [postId]);

    useEffect(() => {
        getFlag(postId).then(setCurrentFlag)
    }, [postId]);

    const flag = useCallback(async () => {
        const flag = await flagPost(postId);
        setCurrentFlag(flag);
        getFlagCountForPost(postId).then(setNumFlags)
    }, [postId]);

    const unflag = useCallback(async () => {
        if (currentFlag) {
            await deleteFlag(currentFlag.post.id)
                .then(() => setCurrentFlag(null))
            getFlagCountForPost(postId).then(setNumFlags)
        }
    }, [currentFlag, postId]);

    const toggleFlag = useCallback(async () => {
        if (currentFlag)
            await unflag()
        else
            await flag()
    }, [currentFlag, flag, unflag]);

    return (
        <Button
            size="sm"
            variant={currentFlag ? "filled" : "light"}
            color="orange"
            onClick={toggleFlag}
        >
            {isAdmin(currentAccount) && `${numFlags} `}
            <FlagIcon size={16}/>
        </Button>
    )
}

export default PostFlagButton;