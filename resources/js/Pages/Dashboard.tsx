import { Head } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t } = useTranslation();

    return (
        <Fragment>
            <Head title={t('dashboard')} />
            <Typography variant="h1">DashboardPage</Typography>
        </Fragment>
    );
};

export default DashboardPage;
