const MediaType = {
    Image: 1,
    Video: 2,
} as const;

export default MediaType;

export type MediaTypeValue = (typeof MediaType)[keyof typeof MediaType];
