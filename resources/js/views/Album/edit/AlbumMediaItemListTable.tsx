import { Language } from '@/enums/language';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MaterialReactTable, MRT_RowSelectionState, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditAlbumPageProps } from '../../../Pages/Album/Edit';
import useAlbumMediaItemColumns from '../hooks/useAlbumMediaItemColumns';
import BulkDeleteAlbumMediaItemsButton from './BulkDeleteAlbumMediaItemsButton';

const AlbumMediaItemListTable = () => {
    const { t, i18n } = useTranslation();
    const { album } = usePage<PageProps<EditAlbumPageProps>>().props;

    const [isLoading, setIsLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<MRT_RowSelectionState>({});

    const columns = useAlbumMediaItemColumns();
    const table = useMaterialReactTable({
        columns,
        data: album.media_items,
        enablePagination: false,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableKeyboardShortcuts: false,
        enableBottomToolbar: false,
        enableRowNumbers: true,
        positionActionsColumn: 'last',
        enableRowSelection: true,
        renderTopToolbar,
        mrtTheme: {
            baseBackgroundColor: 'rgb(var(--mui-palette-background-paperChannel))',
            selectedRowBackgroundColor: 'rgb(var(--mui-palette-primary-mainChannel) / 0.16)',
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
        state: { isLoading, rowSelection: selectedRows },
        onRowSelectionChange: setSelectedRows,
        getRowId: (originalRow) => originalRow.id.toString(),
        localization: getTableLocalization(),
    });

    function getTableLocalization() {
        switch (i18n.language) {
            case Language.Vietnamese:
                return MRT_Localization_VI;
            case Language.English:
                return MRT_Localization_EN;
            default:
                return MRT_Localization_EN;
        }
    }

    function renderTopToolbar() {
        return (
            <Stack divider={<Divider />}>
                <CardHeader title={t('media_of_album')} />
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4} flexWrap="wrap" p={4}>
                    <Stack direction="row" alignItems="center" gap={2}>
                        <BulkDeleteAlbumMediaItemsButton
                            selectedAlbumMediaIds={Object.keys(selectedRows).map((key) => Number(key))}
                        />
                    </Stack>
                    <Button
                        LinkComponent={Link}
                        href={route('albums.media.create', album)}
                        disabled={!!album.deleted_at}
                        startIcon={<CloudUploadOutlinedIcon />}
                    >
                        {t('upload')}
                    </Button>
                </Stack>
            </Stack>
        );
    }

    return <MaterialReactTable table={table} />;
};

export default AlbumMediaItemListTable;
