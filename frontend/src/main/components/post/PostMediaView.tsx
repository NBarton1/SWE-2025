import {AspectRatio, Image} from "@mantine/core";
import type {Content} from "../../types/content.ts";


interface PostMediaViewProps {
    content: Content
}

function PostMediaView({ content }: PostMediaViewProps) {
    const isVideo = content.contentType?.startsWith("video/");

    return isVideo ? (
        <AspectRatio
            data-testid="post-media-view-video"
            ratio={16/9}
            mx="auto"
        >
            <video
                controls
                style={{
                    objectFit: 'contain'
                }}
            >
                <source src={content.downloadUrl} type={content.contentType} />
            </video>
        </AspectRatio>
    ) : (
        <AspectRatio
            data-testid="post-media-view-image"
            ratio={16/9}
            mx="auto"
        >
            <Image
                src={content.downloadUrl}
                fit="contain"
            />
        </AspectRatio>
    );
}

export default PostMediaView;
