import { Head } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const AlbumListPage = () => {
    const { t } = useTranslation();

    return (
        <Fragment>
            <Head title={t('list_of_albums')} />
            <Typography variant="h1">AlbumListPage</Typography>
        </Fragment>
    );
};

export default AlbumListPage;
