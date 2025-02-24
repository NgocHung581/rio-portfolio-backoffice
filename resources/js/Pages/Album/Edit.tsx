import { PageProps } from '@/types';
import { Album } from '@/types/album';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import AlbumForm from './Partials/AlbumForm';
import AlbumMediaBlock from './Partials/AlbumMediaBlock';

export type EditAlbumPageProps = {
    album: Album;
};

const EditAlbumPage = ({ album }: PageProps<EditAlbumPageProps>) => {
    const { t } = useTranslation();

    return (
        <Stack spacing={6}>
            <Head title={t('edit_album')} />
            <Typography variant="h2">{t('edit_album')}</Typography>
            <AlbumForm album={album} />
            <AlbumMediaBlock />
        </Stack>
    );
};

export default EditAlbumPage;
