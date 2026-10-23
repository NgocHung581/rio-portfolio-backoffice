import Image from '@/Components/Image';
import { Language } from '@/enums/language';
import MediaType from '@/enums/media-type';
import { Project } from '@/types/project';
import { formatRelativeTime } from '@/utils/date';
import { usePage } from '@inertiajs/react';
import { SvgIconComponent } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import StarIcon from '@mui/icons-material/Star';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
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
    const otherLocale = locale === Language.Vietnamese ? Language.English : Language.Vietnamese;
    const dateTimeFormat = new Intl.DateTimeFormat(locale === Language.Vietnamese ? 'vi-VN' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return [
        {
            header: t('project'),
            accessorKey: 'project',
            grow: 3,
            Cell: ({ row }) => (
                <Stack direction="row" alignItems="center" gap={3} minWidth={0}>
                    {/* The cover in the same 4:5 frame it is shown in on the website. */}
                    <Image
                        src={row.original.thumbnail_file_url}
                        alt=""
                        containerSx={{
                            flexShrink: 0,
                            width: 44,
                            aspectRatio: '4/5',
                            overflow: 'hidden',
                            borderRadius: 0.75,
                            border: 1,
                            borderColor: 'divider',
                        }}
                        imageSx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                    />
                    <Box minWidth={0}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            {row.original.is_highlight && (
                                <Tooltip title={t('highlight')}>
                                    <StarIcon
                                        color="warning"
                                        role="img"
                                        aria-label={t('highlight')}
                                        sx={{ fontSize: 18 }}
                                    />
                                </Tooltip>
                            )}
                            <Typography
                                fontWeight={600}
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                {row.original[`title_${locale}`]}
                            </Typography>
                        </Stack>
                        {/* The other translation, so both can be checked at a glance. */}
                        <Typography variant="body2" color="textSecondary" noWrap>
                            {row.original[`title_${otherLocale}`]}
                        </Typography>
                    </Box>
                </Stack>
            ),
        },
        {
            header: t('category'),
            accessorKey: 'category',
            Cell: ({ row }) => {
                const isVideo = row.original.category.media_type === MediaType.Video;

                return (
                    <Stack
                        direction="row"
                        alignItems="center"
                        gap={1.5}
                        minWidth={0}
                        color={isVideo ? 'secondary.main' : 'primary.main'}
                    >
                        {isVideo ? (
                            <VideocamOutlinedIcon fontSize="small" />
                        ) : (
                            <PhotoCameraOutlinedIcon fontSize="small" />
                        )}
                        <Typography variant="body2" fontWeight={500} color="inherit" noWrap>
                            {row.original.category[`name_${locale}`]}
                        </Typography>
                    </Stack>
                );
            },
        },
        {
            header: t('content'),
            accessorKey: 'galleries',
            Cell: ({ row }) => {
                const galleriesCount = row.original.galleries.length;
                const mediaItemsCount = row.original.galleries.reduce(
                    (count, gallery) => count + gallery.media_items.length,
                    0,
                );

                if (!mediaItemsCount) {
                    return (
                        <Stack direction="row" alignItems="center" gap={1} color="warning.dark">
                            <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" color="inherit">
                                {t('reason_no_media')}
                            </Typography>
                        </Stack>
                    );
                }

                return (
                    <Box>
                        <Typography variant="body2">{t('files_total', { count: mediaItemsCount })}</Typography>
                        <Typography variant="caption" color="textSecondary">
                            {t('galleries_count', { count: galleriesCount })}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            header: t('web_visibility'),
            accessorKey: 'web_visibility',
            Cell: ({ row }) => {
                const webVisibilityOption = webVisibilityOptions.find(
                    (option) => option.value === row.original.web_visibility,
                )!;

                const Icon = ICON_MAP[webVisibilityOption.icon];

                return (
                    <Chip
                        variant="outlined"
                        icon={<Icon />}
                        label={webVisibilityOption.label}
                        color={webVisibilityOption.color as ChipProps['color']}
                    />
                );
            },
        },
        {
            header: t('updated'),
            accessorKey: 'updated_at',
            Cell: ({ row }) => (
                <Tooltip title={dateTimeFormat.format(new Date(row.original.updated_at))} placement="bottom-start">
                    <Typography
                        component="time"
                        dateTime={row.original.updated_at}
                        variant="body2"
                        color="textSecondary"
                    >
                        {formatRelativeTime(row.original.updated_at, locale)}
                    </Typography>
                </Tooltip>
            ),
        },
    ];
};

export default useProjectColumns;
