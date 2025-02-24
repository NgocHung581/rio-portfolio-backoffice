import { PageProps, PaginatedData } from '@/types';
import { Album } from '@/types/album';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import AlbumListTable from './Partials/AlbumListTable';

export type AlbumListPageProps = {
    albums: PaginatedData<Album>;
    initSearchForm: { keyword: string };
};

const AlbumListPage = (props: PageProps<AlbumListPageProps>) => {
    const { t } = useTranslation();

    console.log(props);

    return (
        <Stack spacing={6}>
            <Head title={t('list_of_albums')} />
            <Typography variant="h1">{t('list_of_albums')}</Typography>
            <AlbumListTable />
        </Stack>
    );
};

export default AlbumListPage;
