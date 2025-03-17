import { MediaFile } from './mediaFile';

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
    media_items_count: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};
