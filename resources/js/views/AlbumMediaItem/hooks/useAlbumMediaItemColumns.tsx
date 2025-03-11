import MediaInTable from '@/Components/MediaInTable';
import { EditAlbumPageProps } from '@/Pages/Album/Edit';
import { PageProps } from '@/types';
import { AlbumMediaItem } from '@/types/albumMediaItem';
import { convertBytes } from '@/utils/fileHelper';
import { usePage } from '@inertiajs/react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { MRT_ColumnDef } from 'material-react-table';
import { useTranslation } from 'react-i18next';
import AlbumMediaItemDeleteAction from '../list/AlbumMediaItemDeleteAction';
import { EditingAlbumMediaItem } from '../list/AlbumMediaItemListTable';

type Props = {
    isEditMode: boolean;
    onSetRowEditing: (row: AlbumMediaItem) => void;
    onCancelRowEditing: (row: AlbumMediaItem) => void;
    editingAlbumMediaItems: Record<number, EditingAlbumMediaItem>;
    onChangeAlbumMediaItemInfo: (row: AlbumMediaItem, value: Partial<EditingAlbumMediaItem>) => void;
    errors: Record<string, string>;
    isUpdating: boolean;
};

const useAlbumMediaItemColumns = ({
    isEditMode,
    onSetRowEditing,
    onCancelRowEditing,
    editingAlbumMediaItems,
    onChangeAlbumMediaItemInfo,
    errors,
    isUpdating,
}: Props) => {
    const { t } = useTranslation();
    const { columnSpanOptions, fileTypeOptions, fileType } = usePage<PageProps<EditAlbumPageProps>>().props;

    const editingAlbumMediaItemIds = Object.keys(editingAlbumMediaItems).map((albumMediaItemId) =>
        Number(albumMediaItemId),
    );

    const checkRowEditing = (row: AlbumMediaItem) => {
        return editingAlbumMediaItemIds.some((albumMediaItemId) => albumMediaItemId === row.id);
    };

    const columns: MRT_ColumnDef<AlbumMediaItem>[] = [
        {
            accessorKey: 'media',
            accessorFn: (row) => (
                <Stack direction="row" alignItems="center" gap={3}>
                    <MediaInTable
                        src={row.video_thumbnail_url ?? row.url}
                        alt=""
                        isVideo={row.type === fileType.video}
                        videoSrc={row.url}
                    />
                    <Box flex={1} overflow="hidden">
                        <Typography variant="body2" fontWeight={500} noWrap>
                            {row.file_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {row.type === fileType.image && `${convertBytes(row.file_size)} KB`}
                            {row.type === fileType.video && `${convertBytes(row.file_size, 'MB')} MB`}
                        </Typography>
                    </Box>
                </Stack>
            ),
            header: t('media'),
        },
        {
            accessorKey: 'type',
            accessorFn: (row) => (
                <Chip
                    size="small"
                    color={row.type === fileType.image ? 'info' : 'warning'}
                    label={fileTypeOptions.find((option) => option.value === row.type)?.label}
                />
            ),
            header: t('type'),
            size: 100,
        },
        {
            accessorKey: 'column_span',
            header: t('column_width'),
            size: 200,
            Cell: ({ row }) => {
                if (checkRowEditing(row.original)) {
                    return (
                        <TextField
                            select
                            value={editingAlbumMediaItems[row.original.id]?.column_span ?? row.original.column_span}
                            slotProps={{ inputLabel: { required: true } }}
                            onChange={(e) =>
                                onChangeAlbumMediaItemInfo(row.original, { column_span: Number(e.target.value) })
                            }
                            error={!!errors[`album_media_items.${row.original.id}.column_span`]}
                            helperText={errors[`album_media_items.${row.original.id}.column_span`]}
                            disabled={isUpdating}
                        >
                            {columnSpanOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    );
                }

                return (
                    <Typography variant="body2">
                        {columnSpanOptions.find((option) => option.value === row.original.column_span)?.label}
                    </Typography>
                );
            },
        },
        {
            accessorKey: 'is_displayed_on_banner',
            header: t('display_on_banner'),
            size: 130,
            Cell: ({ row }) => {
                if (checkRowEditing(row.original)) {
                    return (
                        <Switch
                            edge="start"
                            checked={
                                editingAlbumMediaItems[row.original.id]?.is_displayed_on_banner ??
                                row.original.is_displayed_on_banner
                            }
                            onChange={(_, isChecked) =>
                                onChangeAlbumMediaItemInfo(row.original, { is_displayed_on_banner: isChecked })
                            }
                            disabled={isUpdating || row.original.type === fileType.video}
                        />
                    );
                } else if (row.original.is_displayed_on_banner) {
                    return <CheckCircleOutlinedIcon color="success" />;
                } else {
                    return <CancelOutlinedIcon color="error" />;
                }
            },
        },
        {
            accessorKey: 'action',
            header: t('action'),
            muiTableHeadCellProps: { align: 'center' },
            Cell: ({ row }) => (
                <Stack direction="row" alignItems="center" justifyContent="center">
                    {isEditMode ? (
                        checkRowEditing(row.original) ? (
                            <IconButton
                                size="small"
                                color="error"
                                disabled={isUpdating}
                                onClick={() => onCancelRowEditing(row.original)}
                            >
                                <EditOffOutlinedIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                size="small"
                                color="info"
                                disabled={isUpdating}
                                onClick={() => onSetRowEditing(row.original)}
                            >
                                <EditOutlinedIcon />
                            </IconButton>
                        )
                    ) : (
                        <AlbumMediaItemDeleteAction albumMediaItem={row.original} />
                    )}
                </Stack>
            ),
        },
    ];

    return columns;
};

export default useAlbumMediaItemColumns;
