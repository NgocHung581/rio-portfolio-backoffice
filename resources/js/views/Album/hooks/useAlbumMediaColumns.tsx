import ImageInTable from '@/Components/ImageInTable';
import { MediaType } from '@/enums/mediaType';
import { EditAlbumPageProps } from '@/Pages/Album/Edit';
import { PageProps } from '@/types';
import { AlbumMedia } from '@/types/album';
import { convertBytes } from '@/utils/fileHelper';
import { usePage } from '@inertiajs/react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AlbumMediaRowActions from '../edit/AlbumMediaRowActions';

const useAlbumMediaColumns = () => {
    const { t, i18n } = useTranslation();
    const { albumMediaColumnSpanOptions, mediaTypeOptions } = usePage<PageProps<EditAlbumPageProps>>().props;

    const columns = useMemo<MRT_ColumnDef<AlbumMedia>[]>(
        () => [
            {
                accessorFn: (row) => (
                    <Stack direction="row" alignItems="center" gap={3}>
                        <ImageInTable src={row.file_path} alt="" />
                        <Box flex={1} overflow="hidden">
                            <Typography variant="body2" fontWeight={500} noWrap>
                                {row.file_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {row.type === MediaType.Image
                                    ? `${convertBytes(row.file_size)} KB`
                                    : `${convertBytes(row.file_size, 'GB')} GB`}
                            </Typography>
                        </Box>
                    </Stack>
                ),
                header: t('media'),
            },
            {
                accessorFn: (row) => (
                    <Chip
                        size="small"
                        color={row.type === MediaType.Image ? 'info' : 'warning'}
                        label={mediaTypeOptions.find((option) => option.value === row.type)?.label}
                    />
                ),
                header: t('type'),
                size: 100,
            },
            {
                accessorFn: (row) => (
                    <Typography variant="body2">
                        {albumMediaColumnSpanOptions.find((option) => option.value === row.column_span)?.label}
                    </Typography>
                ),
                header: t('column_width'),
                size: 200,
            },
            {
                accessorFn: (row) =>
                    row.is_displayed_on_banner ? (
                        <CheckCircleOutlinedIcon color="success" />
                    ) : (
                        <CancelOutlinedIcon color="error" />
                    ),
                header: t('display_on_banner'),
                size: 130,
            },
            {
                accessorFn: (row) => <AlbumMediaRowActions albumMedia={row} />,
                header: t('actions'),

                muiTableHeadCellProps: { align: 'center' },
            },
        ],
        [i18n.language],
    );

    return columns;
};

export default useAlbumMediaColumns;
