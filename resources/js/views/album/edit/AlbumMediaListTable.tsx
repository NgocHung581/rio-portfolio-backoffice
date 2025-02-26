import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditAlbumPageProps } from '../../../Pages/Album/Edit';

const AlbumMediaListTable = () => {
    const { t } = useTranslation();
    const { album } = usePage<PageProps<EditAlbumPageProps>>().props;

    const [isLoading, setIsLoading] = useState(false);

    const table = useMaterialReactTable({
        columns: [],
        data: [],
        enablePagination: false,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableKeyboardShortcuts: false,
        enableBottomToolbar: false,
        enableRowNumbers: true,
        positionActionsColumn: 'last',
        renderTopToolbar,
        // renderBottomToolbar,
        mrtTheme: {
            baseBackgroundColor: 'rgb(var(--mui-palette-background-paperChannel))',
        },
        displayColumnDefOptions: {
            'mrt-row-numbers': {
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
        },
        renderEmptyRowsFallback: () => (
            <Typography textAlign="center" color="error" py={4}>
                {t('no_data_available')}
            </Typography>
        ),
        state: { isLoading },
    });

    function renderTopToolbar() {
        return (
            <Stack divider={<Divider />}>
                <CardHeader title={t('media_of_album')} />
                <Stack direction="row" alignItems="center" gap={4} flexWrap="wrap" p={4}>
                    <Button
                        LinkComponent={Link}
                        href={route('albums.create')}
                        disabled={!!album.deleted_at}
                        startIcon={<AddIcon />}
                    >
                        {t('add')}
                    </Button>
                </Stack>
            </Stack>
        );
    }

    return <MaterialReactTable table={table} />;
};

export default AlbumMediaListTable;
