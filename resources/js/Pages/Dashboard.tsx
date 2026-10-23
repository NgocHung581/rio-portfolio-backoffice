import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import PortfolioOverview from './Dashboard/components/PortfolioOverview';
import RecentProjects from './Dashboard/components/RecentProjects';
import ToDoList from './Dashboard/components/ToDoList';
import { DashboardData } from './Dashboard/types';

const DashboardPage = ({
    projectStatistics,
    categories,
    recentProjects,
    privateProjects,
    websiteContent,
}: PageProps<DashboardData>) => {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    return (
        <Stack gap={{ xs: 6, sm: 8 }}>
            <Head title={t('dashboard')} />
            <Stack
                component="header"
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                justifyContent="space-between"
                gap={4}
            >
                <Stack gap={2}>
                    <Typography variant="h1">{t('welcome_back_user', { user: auth.user.name })}</Typography>
                    <Typography color="textSecondary" maxWidth="65ch">
                        {t('dashboard_description')}
                    </Typography>
                </Stack>
                <Button
                    LinkComponent={Link}
                    href={route('projects.create')}
                    startIcon={<AddOutlinedIcon />}
                    sx={{ flexShrink: 0 }}
                >
                    {t('add_a_new_project')}
                </Button>
            </Stack>

            <RecentProjects projects={recentProjects} />

            <Grid container spacing={6}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <PortfolioOverview statistics={projectStatistics} categories={categories} />
                </Grid>
                <Grid size={{ xs: 12, lg: 5 }}>
                    <ToDoList
                        privateProjects={privateProjects}
                        privateProjectsCount={projectStatistics.private}
                        websiteContent={websiteContent}
                    />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default DashboardPage;
