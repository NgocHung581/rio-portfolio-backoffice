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
