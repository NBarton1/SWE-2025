import {Image, rem} from "@mantine/core";
import type {ContentPreview} from "../../types/content.ts";

interface EditPostMediaProps {
    contentPreview: ContentPreview,
}

function PostMediaPreview({ contentPreview }: EditPostMediaProps) {
    const contentType = contentPreview.file.type;
    const isVideo = contentType.startsWith("video/");

    return isVideo ? (
        <video
            data-testid="post-media-preview-video"
            controls
            style={{
                objectFit: "contain",
                height: rem(200),
                width: "auto",
                maxWidth: "100%",
            }}
        >
            <source src={contentPreview.previewUrl} type={contentType}/>
        </video>
    ) : (
        <Image
            data-testid="post-media-preview-image"
            src={contentPreview.previewUrl}
            radius="md"
            fit="contain"
            h={rem(200)}
            w="auto"
        />
    );

}

export default PostMediaPreview;
