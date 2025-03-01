import { MediaType } from '@/enums/mediaType';

export type MediaFile = {
    id: number;
    url: string;
    file_type: MediaType;
    file_name: string;
    file_size: number;
    created_at: string;
    updated_at: string;
};
