import { MediaTypeValue } from '@/enums/media-type';
import { Option } from '.';
import { Category } from './category';

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
    created_at: string;
    updated_at: string;
    category: Category;
    galleries: Gallery[];
};

export type Gallery = {
    id: number;
    project_id: number;
    caption: string;
    created_at: string;
    updated_at: string;
    media_items: MediaItem[];
};

export type MediaItem = {
    id: number;
    gallery_id: number;
    file_path: string;
    file_url: string;
    frame: string;
    is_banner: boolean;
    created_at: string;
    updated_at: string;
};
