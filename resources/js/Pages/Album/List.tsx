import { PaginatedData } from '@/types';
import { Album } from '@/types/album';
import AlbumListTable from '@/views/album/list/AlbumListTable';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export type AlbumListPageProps = {
    albums: PaginatedData<Album>;
    initSearchForm: { keyword: string };
};

const AlbumListPage = () => {
    const { t } = useTranslation();

    return (
        <Stack spacing={6}>
            <Head title={t('list_of_albums')} />
            <Typography variant="h1">{t('list_of_albums')}</Typography>
            <AlbumListTable />
        </Stack>
    );
};

export default AlbumListPage;
