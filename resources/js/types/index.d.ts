import { ReactNode } from 'react';
import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    message: string;
    localeOptions: Option<string>[];
    locale: 'en' | 'vi';
};

export type PropsWithChildren<T = unknown> = T & { children: ReactNode };

export type Option<TValue = number> = {
    label: string;
    value: TValue;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { active: boolean; label: string; url: string | null }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};
