import { MediaTypeValue } from '@/enums/media-type';
import { Option } from '.';

export type ProjectFormPageProps = {
    categoryOptions: (Option & { media_type: MediaTypeValue })[];
    webVisibilityOptions: Option[];
    mediaFrameOptions: Option<string>[];
    maxMediaItemsCountPerGallery: number;
};

export type Project = {
    id: number;
    category_id: number;
    title_en: string;
    title_vi: string;
    description_en: string;
    description_vi: string;
    summary_en: string;
    summary_vi: string;
    is_highlight: boolean;
    web_visibility: number;
    thumbnail_url: string;
    thumbnail_file_path: string;
    thumbnail_frame: string;
    created_at: Date;
    updated_at: Date;
};
