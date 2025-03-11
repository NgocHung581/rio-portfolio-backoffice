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
};

export type PropsWithChildren<T = unknown> = T & { children: ReactNode };

export type Option<TValue = number> = {
    label: string;
    value: TValue;
};

type PaginatedDataLinks = {
    first: string;
    last: string;
};

type PaginatedDataMeta = {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
};

export type PaginatedData<T> = {
    data: T[];
    links: PaginatedDataLinks;
    meta: PaginatedDataMeta;
};
