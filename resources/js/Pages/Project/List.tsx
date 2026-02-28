import { Option, PageProps, PaginatedData } from '@/types';
import { Project } from '@/types/project';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import ProjectSearchForm from './components/ProjectSearchForm';
import ProjectTable from './components/ProjectTable';
import { ProjectListPageProvider } from './contexts/projectListPageContext';

export type ProjectListPageQuery = {
    category_ids?: number[];
    keyword?: string;
    page: number;
    per_page: number;
};

export type ProjectListPageProps = PageProps<{
    projects: PaginatedData<Project>;
    categoryOptions: Option[];
    perPageOptions: Option[];
    webVisibilityOptions: (Option & { color: string; icon: string })[];
    query: ProjectListPageQuery;
}>;

const ProjectListPage = () => {
    const { t } = useTranslation();

    return (
        <ProjectListPageProvider>
            <Stack gap={{ xs: 4, sm: 6 }}>
                <Head title={t('list_of_projects')} />
                <Typography variant="h1">{t('list_of_projects')}</Typography>
                <ProjectSearchForm />
                <ProjectTable />
            </Stack>
        </ProjectListPageProvider>
    );
};

export default ProjectListPage;
