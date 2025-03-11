export type AlbumMediaItem = {
    id: number;
    album_id: number;
    type: number;
    url: string;
    file_name: string;
    file_size: number;
    column_span: number;
    is_displayed_on_banner: boolean;
    video_thumbnail_url?: string;
};
