import { MediaTypeValue } from '@/enums/media-type';
import { WebVisibilityValue } from '@/enums/web-visibility';

export type ProjectSummary = {
    id: number;
    title_en: string;
    title_vi: string;
    thumbnail_file_url: string;
    web_visibility: WebVisibilityValue;
    is_highlight: boolean;
    updated_at: string;
    category_name_en: string;
    category_name_vi: string;
    category_media_type: MediaTypeValue;
    media_items_count: number;
};

export type ProjectStatistics = {
    total: number;
    public: number;
    private: number;
    highlighted: number;
};

export type CategorySummary = {
    id: number;
    name_en: string;
    name_vi: string;
    media_type: MediaTypeValue;
    projects_count: number;
};

export type WebsiteContentStatus = {
    has_avatar: boolean;
    has_introduction: boolean;
    partner_logos_count: number;
};

export type DashboardData = {
    projectStatistics: ProjectStatistics;
    categories: CategorySummary[];
    recentProjects: ProjectSummary[];
    privateProjects: ProjectSummary[];
    websiteContent: WebsiteContentStatus;
};
