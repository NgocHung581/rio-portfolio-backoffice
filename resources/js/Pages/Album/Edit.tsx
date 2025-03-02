import { Option, PageProps, PaginatedData } from '@/types';
import { Album, AlbumMediaItem } from '@/types/album';
import AlbumMediaItemListTable from '@/views/AlbumMediaItem/list/AlbumMediaItemListTable';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import AlbumForm from '../../views/Album/shared/AlbumForm';

export type EditAlbumPageProps = {
    album: Album;
    albumMediaItems: PaginatedData<AlbumMediaItem>;
    columnSpanOptions: Option[];
    fileTypeOptions: Option[];
};

const EditAlbumPage = ({ album }: PageProps<EditAlbumPageProps>) => {
    const { t } = useTranslation();

    return (
        <Stack spacing={6}>
            <Head title={t('edit_album')} />
            <Typography variant="h2">{t('edit_album')}</Typography>
            <AlbumForm album={album} />
            <AlbumMediaItemListTable />
        </Stack>
    );
};

export default EditAlbumPage;
