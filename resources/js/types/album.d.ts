import { MediaType } from '@/enums/mediaType';
import { MediaFile } from './mediaFile';

export type AlbumMediaItem = {
    id: number;
    album_id: number;
    file_type: MediaType;
    file_path: string;
    file_name: string;
    file_size: number;
    column_span: number;
    is_displayed_on_banner: boolean;
    created_at: string;
    updated_at: string;
};

export type Album = {
    id: number;
    title_en: string;
    title_vi: string;
    name_en: string;
    name_vi: string;
    description_en: string;
    description_vi: string;
    summary_en: string;
    summary_vi: string;
    is_highlight: boolean;
    thumbnail: MediaFile;
    media_items: AlbumMediaItem[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type AlbumFormPayload = {
    title_en: string;
    title_vi: string;
    name_en: string;
    name_vi: string;
    description_en: string;
    description_vi: string;
    summary_en: string;
    summary_vi: string;
    thumbnail_file?: File;
    is_highlight: boolean;
    is_thumbnail_deleted?: boolean;
};
