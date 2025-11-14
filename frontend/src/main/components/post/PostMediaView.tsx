import {Image} from "@mantine/core";
import type {Content} from "../../types/content.ts";


interface PostMediaViewProps {
    content: Content
}

function PostMediaView({ content }: PostMediaViewProps) {

    return (
        <Image
            src={content.downloadUrl}
            fit="contain"
            h={400}
        />
    );
}

export default PostMediaView;
