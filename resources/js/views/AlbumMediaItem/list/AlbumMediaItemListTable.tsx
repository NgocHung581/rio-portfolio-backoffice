import Pagination from '@/Components/Pagination';
import { Language } from '@/enums/language';
import { PageProps } from '@/types';
import { AlbumMediaItem } from '@/types/album';
import { Link, router, usePage } from '@inertiajs/react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MaterialReactTable, MRT_RowSelectionState, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { EditAlbumPageProps } from '../../../Pages/Album/Edit';
import useAlbumMediaItemColumns from '../hooks/useAlbumMediaItemColumns';
import BulkDeleteAlbumMediaItemsButton from './BulkDeleteAlbumMediaItemsButton';

export type EditingAlbumMediaItem = {
    is_displayed_on_banner: boolean;
    column_span: number;
};

const AlbumMediaItemListTable = () => {
    const { t, i18n } = useTranslation();
    const { album, albumMediaItems } = usePage<PageProps<EditAlbumPageProps>>().props;

    const [selectedRows, setSelectedRows] = useState<MRT_RowSelectionState>({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingAlbumMediaItems, setEditingAlbumMediaItems] = useState<Record<number, EditingAlbumMediaItem>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isDeletedAlbum = !!album.deleted_at;
    const hasAlbumMediaItems = !!albumMediaItems.data.length;

    const columns = useAlbumMediaItemColumns({
        isEditMode,
        onSetRowEditing: handleSetRowEditing,
        onCancelRowEditing: handleCancelRowEditing,
        editingAlbumMediaItems,
        onChangeAlbumMediaItemInfo: handleChangeAlbumMediaItemInfo,
        errors,
        isUpdating,
    });
    const table = useMaterialReactTable({
        columns,
        data: albumMediaItems.data,
        enablePagination: false,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableKeyboardShortcuts: false,
        enableBottomToolbar: hasAlbumMediaItems,
        enableRowNumbers: true,
        enableRowSelection: !isDeletedAlbum && !isEditMode && hasAlbumMediaItems,
        renderTopToolbar,
        renderBottomToolbar,
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

    useEffect(() => {
        if (isDeletedAlbum) {
            handleTurnOffEditMode();
        }
    }, [isDeletedAlbum]);

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

    const handleTurnOnEditMode = () => {
        setIsEditMode(true);
        setSelectedRows({});
        setErrors({});
    };

    function handleTurnOffEditMode() {
        setIsEditMode(false);
        setEditingAlbumMediaItems({});
    }

    function handleSetRowEditing(row: AlbumMediaItem) {
        setEditingAlbumMediaItems((prev) => ({
            ...prev,
            [row.id]: {
                is_displayed_on_banner: row.is_displayed_on_banner,
                column_span: row.column_span,
            },
        }));
    }

    function handleCancelRowEditing(row: AlbumMediaItem) {
        const cloned = { ...editingAlbumMediaItems };

        delete cloned[row.id];
        setEditingAlbumMediaItems(cloned);
    }

    function handleChangeAlbumMediaItemInfo(row: AlbumMediaItem, value: Partial<EditingAlbumMediaItem>) {
        const cloned = { ...editingAlbumMediaItems };

        cloned[row.id] = { ...cloned[row.id], ...value };
        setEditingAlbumMediaItems(cloned);
    }

    const handleUpdateAlbumMediaItems = () => {
        router.put(
            route('albums.media.bulkUpdate', album),
            { album_media_items: editingAlbumMediaItems },
            {
                preserveScroll: true,
                onStart: () => {
                    setIsUpdating(true);
                    setErrors({});
                },
                onFinish: () => setIsUpdating(false),
                onSuccess: ({ props: { message } }) => {
                    toast.success(message);
                    handleTurnOffEditMode();
                },
                onError: (error) => {
                    if (Object.hasOwn(error, 'message')) {
                        toast.error(error.message);
                    } else {
                        setErrors(error);
                    }
                },
            },
        );
    };

    function renderTopToolbar() {
        return (
            <Stack id="media" divider={<Divider />}>
                <CardHeader title={t('media_of_album')} />
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4} flexWrap="wrap" p={4}>
                    <BulkDeleteAlbumMediaItemsButton
                        selectedAlbumMediaIds={Object.keys(selectedRows).map((key) => Number(key))}
                    />
                    <Stack direction="row" alignItems="center" gap={2}>
                        {hasAlbumMediaItems &&
                            (!isEditMode ? (
                                <Button
                                    color="info"
                                    startIcon={<EditOutlinedIcon />}
                                    disabled={isDeletedAlbum || isLoading}
                                    onClick={handleTurnOnEditMode}
                                >
                                    {t('edit')}
                                </Button>
                            ) : (
                                <Fragment>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<EditOffOutlinedIcon />}
                                        onClick={handleTurnOffEditMode}
                                        disabled={isUpdating}
                                    >
                                        {t('cancel')}
                                    </Button>
                                    <Button
                                        loading={isUpdating}
                                        color="info"
                                        startIcon={<SaveOutlinedIcon />}
                                        onClick={handleUpdateAlbumMediaItems}
                                        disabled={Object.keys(editingAlbumMediaItems).length === 0}
                                    >
                                        {t('save')}
                                    </Button>
                                </Fragment>
                            ))}
                        <Button
                            LinkComponent={Link}
                            href={route('albums.media.bulkCreate', album)}
                            disabled={isDeletedAlbum || isUpdating || isLoading}
                            startIcon={<CloudUploadOutlinedIcon />}
                        >
                            {t('upload')}
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        );
    }

    function renderBottomToolbar() {
        return (
            <Stack direction="row" alignContent="center" justifyContent="end" p={4}>
                <Pagination
                    total_pages={albumMediaItems.meta.last_page}
                    page={albumMediaItems.meta.current_page}
                    onChange={(selectedPage) => handleChangePage(selectedPage)}
                    from={albumMediaItems.meta.from}
                    to={albumMediaItems.meta.to}
                    total={albumMediaItems.meta.total}
                    disabled={isLoading}
                />
            </Stack>
        );
    }

    function handleChangePage(selectedPage: number) {
        router.get(
            window.location.href,
            { album_media_page: selectedPage },
            {
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                preserveScroll: true,
                only: ['albumMediaItems'],
            },
        );
    }

    return <MaterialReactTable table={table} />;
};

export default AlbumMediaItemListTable;
