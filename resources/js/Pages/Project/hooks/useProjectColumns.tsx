import GoogleDriveImage from '@/Components/GoogleDriveImage';
import { Project } from '@/types/project';
import { usePage } from '@inertiajs/react';
import { SvgIconComponent } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MRT_ColumnDef } from 'material-react-table';
import { useTranslation } from 'react-i18next';
import { ProjectListPageProps } from '../List';

const ICON_MAP: Record<string, SvgIconComponent> = {
    LockOutline: LockOutlinedIcon,
    PublicOutlined: PublicOutlinedIcon,
};

const useProjectColumns = (): MRT_ColumnDef<Project>[] => {
    const { t } = useTranslation();
    const { locale, webVisibilityOptions } = usePage<ProjectListPageProps>().props;

    return [
        {
            header: t('project'),
            accessorKey: 'project',
            Cell: ({ row }) => {
                return (
                    <Stack direction="row" alignItems="center" gap={2}>
                        {row.original.is_highlight && <StarIcon color="warning" fontSize="small" />}
                        <Box
                            sx={{
                                height: 40,
                                width: 40,
                                border: 1,
                                borderColor: 'divider',
                                p: 1,
                                borderRadius: 1,
                                flexShrink: 0,
                            }}
                        >
                            <GoogleDriveImage
                                fileName={row.original.thumbnail_file_name}
                                containerSx={{ aspectRatio: '1/1' }}
                                skeletonSx={{ borderRadius: 0.5 }}
                                imageSx={{ aspectRatio: '1/1', borderRadius: 0.5 }}
                            />
                        </Box>
                        <Typography>{row.original[`title_${locale}`]}</Typography>
                    </Stack>
                );
            },
        },
        {
            header: t('category'),
            accessorKey: 'category',
            size: 75,
            Cell: ({ row }) => <Typography>{row.original.category[`name_${locale}`]}</Typography>,
        },
        {
            header: t('web_visibility'),
            accessorKey: 'web_visibility',
            size: 50,
            Cell: ({ row }) => {
                const webVisibilityOption = webVisibilityOptions.find(
                    (option) => option.value === row.original.web_visibility,
                )!;

                const Icon = ICON_MAP[webVisibilityOption.icon];

                return (
                    <Chip
                        icon={<Icon />}
                        label={webVisibilityOption.label}
                        color={webVisibilityOption.color as ChipProps['color']}
                    />
                );
            },
        },
    ];
};

export default useProjectColumns;
