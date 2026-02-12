import { Option, PageProps, PaginatedData } from '@/types';
import { Project } from '@/types/project';
import { Head, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type Props = {
    projects: PaginatedData<Project>;
    perPageOptions: Option[];
    webVisibilityOptions: Option[];
};

const ProjectListPage = (props: PageProps<Props>) => {
    const { t } = useTranslation();

    return (
        <Stack spacing={6}>
            <Head title={t('list_of_projects')} />
            <Typography variant="h1">{t('list_of_projects')}</Typography>
            <Button LinkComponent={Link} href={route('projects.create')} startIcon={<AddIcon />}>
                {t('add_new')}
            </Button>
        </Stack>
    );
};

export default ProjectListPage;
