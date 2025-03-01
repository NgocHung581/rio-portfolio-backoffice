import ImageInTable from '@/Components/ImageInTable';
import { Language } from '@/enums/language';
import { Album } from '@/types/album';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AlbumRowActions from '../list/AlbumRowActions';

const useAlbumColumns = () => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const columns = useMemo<MRT_ColumnDef<Album>[]>(() => {
        const isVietnamese = currentLanguage === Language.Vietnamese;

        return [
            {
                accessorFn: (row) => {
                    const name = isVietnamese ? row.name_vi : row.name_en;
                    const title = isVietnamese ? row.title_vi : row.title_en;

                    return (
                        <Stack direction="row" alignItems="center" gap={3}>
                            <ImageInTable src={row.thumbnail.url} alt={name} aspectRatio={4 / 5} />
                            <Stack flex={1} overflow="hidden">
                                <Typography variant="body2" fontWeight={500}>
                                    {name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {title}
                                </Typography>
                            </Stack>
                        </Stack>
                    );
                },
                header: t('album'),
                size: 200,
            },
            {
                accessorFn: (row) => row.media_items.length,
                header: t('number_of_media'),
                size: isVietnamese ? 125 : 50,
            },
            {
                accessorFn: (row) =>
                    row.is_highlight ? (
                        <CheckCircleOutlinedIcon color="success" />
                    ) : (
                        <CancelOutlinedIcon color="error" />
                    ),
                header: t('highlight'),
                size: 75,
            },
            {
                accessorFn: (row) => (
                    <Chip
                        size="small"
                        {...(!!row.deleted_at
                            ? { label: t('inactive'), color: 'error' }
                            : { label: t('active'), color: 'success' })}
                    />
                ),
                header: t('status'),
                size: 50,
            },
            {
                accessorFn: (row) => <AlbumRowActions album={row} />,
                header: t('actions'),
                size: 50,
                muiTableHeadCellProps: { align: 'center' },
            },
        ];
    }, [currentLanguage]);

    return columns;
};

export default useAlbumColumns;
