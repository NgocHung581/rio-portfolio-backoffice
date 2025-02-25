import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import AlbumForm from '../../views/album/shared/AlbumForm';

const CreateAlbumPage = () => {
    const { t } = useTranslation();

    return (
        <Stack spacing={6}>
            <Head title={t('add_new_album')} />
            <Typography variant="h2">{t('add_new_album')}</Typography>
            <AlbumForm />
        </Stack>
    );
};

export default CreateAlbumPage;
