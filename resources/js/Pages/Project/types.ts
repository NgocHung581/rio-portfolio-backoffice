export type GalleryMediaItemData = {
    id: string | number;
    file_url: string;
    frame: string;
    is_banner: boolean;
};

export type GalleryData = {
    id: string | number;
    media_items: GalleryMediaItemData[];
    caption: string;
};
