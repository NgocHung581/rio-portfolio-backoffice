import { Head } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const SettingAboutPage = () => {
    const { t } = useTranslation();

    return (
        <Fragment>
            <Head title={t('setting_about_page')} />
            <Typography variant="h1">SettingAboutPage</Typography>
        </Fragment>
    );
};

export default SettingAboutPage;
