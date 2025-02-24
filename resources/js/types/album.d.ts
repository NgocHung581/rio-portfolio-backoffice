import { MediaType } from '@/enums/mediaType';

export type Media = {
    id: number;
    type: MediaType;
    url: string;
    file_name: string;
    file_size: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
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
    thumbnail: Media;
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
