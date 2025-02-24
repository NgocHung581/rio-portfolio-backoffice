import { Language } from '@/enums/language';
import { Album } from '@/types/album';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AlbumRowActions from '../Partials/AlbumRowActions';

const useAlbumColumns = () => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const columns = useMemo<MRT_ColumnDef<Album>[]>(
        () => [
            {
                accessorFn: (row) => (
                    <Stack direction="row" alignItems="center" gap={3}>
                        <Box
                            height={40}
                            width={40}
                            p={1}
                            border={1}
                            borderColor="divider"
                            borderRadius={1}
                            overflow="hidden"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{ img: { borderRadius: 0.5, height: 1 } }}
                        >
                            <img src={row.thumbnail.url} alt="" />
                        </Box>
                        <Stack flex={1} overflow="hidden">
                            <Typography variant="body2" fontWeight={500}>
                                {currentLanguage === Language.Vietnamese ? row.name_vi : row.name_en} Lorem ipsum dolor
                                sit amet, consectetur
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {currentLanguage === Language.Vietnamese ? row.title_vi : row.title_en}
                            </Typography>
                        </Stack>
                    </Stack>
                ),
                header: t('album'),
                size: 300,
            },
            {
                header: t('number_of_media'),
                size: currentLanguage === Language.Vietnamese ? 150 : 50,
            },
            {
                accessorFn: (row) =>
                    row.is_highlight ? (
                        <CheckCircleOutlinedIcon color="success" />
                    ) : (
                        <CancelOutlinedIcon color="error" />
                    ),
                header: t('highlight'),
                size: 50,
            },
            {
                accessorFn: (row) =>
                    !!row.deleted_at ? (
                        <Chip label={t('inactive')} color="error" size="small" />
                    ) : (
                        <Chip label={t('active')} color="success" size="small" />
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
        ],
        [currentLanguage],
    );

    return columns;
};

export default useAlbumColumns;
