import { Option, PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import AlbumForm from '../../views/Album/shared/AlbumForm';

export type CreateAlbumPageProps = {
    aspectRatioOptions: Option<string>[];
};

const CreateAlbumPage = ({ aspectRatioOptions }: PageProps<CreateAlbumPageProps>) => {
    const { t } = useTranslation();

    return (
        <Stack spacing={6}>
            <Head title={t('add_new_album')} />
            <Typography variant="h2">{t('add_new_album')}</Typography>
            <AlbumForm aspectRatioOptions={aspectRatioOptions} />
        </Stack>
    );
};

export default CreateAlbumPage;
