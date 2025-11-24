import {Box} from "@mantine/core";
import type {Post} from "../../types/post.ts";
import {Carousel} from "@mantine/carousel";
import '@mantine/carousel/styles.css';
import PostMediaView from "./PostMediaView.tsx";

interface ViewPostsProps {
    post: Post
}

function PostMediaCarousel({ post }: ViewPostsProps) {

    const media = post.media;

    return media.length > 0 && (
        <Box mb="md" w="100%">
            <Carousel
                id="image-carousel"
                withIndicators
                withControls={media.length > 1}
                slideSize="100%"
            >
                {media.map((content, index) => (
                    <Carousel.Slide key={index}>
                        <PostMediaView content={content} />
                    </Carousel.Slide>
                ))}
            </Carousel>
        </Box>
    )
}

export default PostMediaCarousel;
