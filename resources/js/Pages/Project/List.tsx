import { Option, PageProps, PaginatedData } from '@/types';
import { Project } from '@/types/project';
import { Head, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
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
                <Stack
                    component="header"
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                    justifyContent="space-between"
                    gap={4}
                >
                    <Stack gap={2}>
                        <Typography variant="h1">{t('list_of_projects')}</Typography>
                        <Typography color="textSecondary" maxWidth="65ch">
                            {t('projects_description')}
                        </Typography>
                    </Stack>
                    <Button
                        LinkComponent={Link}
                        href={route('projects.create')}
                        startIcon={<AddIcon />}
                        sx={{ flexShrink: 0 }}
                    >
                        {t('add_a_new_project')}
                    </Button>
                </Stack>
                <ProjectTable />
            </Stack>
        </ProjectListPageProvider>
    );
};

export default ProjectListPage;
