import { Head, usePage } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    return (
        <Fragment>
            <Head title={t('dashboard')} />
            <Typography variant="h1" textAlign="center" color="primary">
                {t('welcome_back_user', { user: auth.user.name })}
            </Typography>
        </Fragment>
    );
};

export default DashboardPage;
