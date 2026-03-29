import { MediaTypeValue } from '@/enums/media-type';

export type Category = {
    id: number;
    name_en: string;
    name_vi: string;
    media_type: MediaTypeValue;
    web_visibility: number;
    created_at: string;
    updated_at: string;
};
