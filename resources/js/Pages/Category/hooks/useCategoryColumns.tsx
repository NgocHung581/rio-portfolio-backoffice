import Image from '@/Components/Image';
import { Language } from '@/enums/language';
import MediaType from '@/enums/media-type';
import { Link, usePage } from '@inertiajs/react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MRT_ColumnDef } from 'material-react-table';
import { useTranslation } from 'react-i18next';
import { CategoryListItem, CategoryListPageProps } from '../List';

const useCategoryColumns = (): MRT_ColumnDef<CategoryListItem>[] => {
    const { t } = useTranslation();
    const { locale, mediaTypeOptions } = usePage<CategoryListPageProps>().props;
    const otherLocale = locale === Language.Vietnamese ? Language.English : Language.Vietnamese;

    return [
        {
            header: t('category'),
            accessorKey: 'category',
            grow: 2,
            Cell: ({ row }) => (
                <Box minWidth={0}>
                    <Typography fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
                        {row.original[`name_${locale}`]}
                    </Typography>
                    {/* The other translation, so both can be checked at a glance. */}
                    <Typography variant="body2" color="textSecondary" sx={{ overflowWrap: 'anywhere' }}>
                        {row.original[`name_${otherLocale}`]}
                    </Typography>
                </Box>
            ),
        },
        {
            header: t('classification'),
            accessorKey: 'media_type',
            Cell: ({ row }) => {
                const isVideo = row.original.media_type === MediaType.Video;

                return (
                    <Chip
                        variant="outlined"
                        color={isVideo ? 'secondary' : 'primary'}
                        icon={isVideo ? <VideocamOutlinedIcon /> : <PhotoCameraOutlinedIcon />}
                        label={mediaTypeOptions.find((option) => option.value === row.original.media_type)?.label}
                    />
                );
            },
        },
        {
            header: t('projects'),
            accessorKey: 'projects_count',
            grow: 2,
            Cell: ({ row }) => {
                const { projects, projects_count: projectsCount } = row.original;

                if (!projectsCount) {
                    return (
                        <Typography variant="body2" color="textSecondary">
                            {t('no_projects_in_category')}
                        </Typography>
                    );
                }

                return (
                    <Stack
                        component={Link}
                        href={route('projects.index', { category_ids: [row.original.id] })}
                        direction="row"
                        alignItems="center"
                        gap={3}
                        mx={-2}
                        px={2}
                        py={1}
                        borderRadius={1}
                        color="primary.main"
                        sx={{
                            textDecoration: 'none',
                            '& .projects-count': {
                                textDecoration: 'underline',
                                textDecorationColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.4)',
                                textUnderlineOffset: 3,
                            },
                            '&:hover': { bgcolor: 'action.hover' },
                            '&:hover .projects-count': { textDecorationColor: 'currentcolor' },
                            '&:focus-visible': {
                                outline: '2px solid var(--mui-palette-primary-main)',
                                outlineOffset: 2,
                            },
                        }}
                    >
                        {/* A few covers, overlapping like prints in a stack. */}
                        <Stack direction="row" aria-hidden>
                            {projects.map((project, index) => (
                                <Image
                                    key={project.id}
                                    src={project.thumbnail_file_url}
                                    alt=""
                                    containerSx={{
                                        width: 32,
                                        aspectRatio: '4/5',
                                        ml: index ? -2.5 : 0,
                                        zIndex: projects.length - index,
                                        overflow: 'hidden',
                                        borderRadius: 0.75,
                                        border: 2,
                                        borderColor: 'background.paper',
                                        boxShadow: 1,
                                    }}
                                    imageSx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                                />
                            ))}
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={0.5}>
                            <Typography className="projects-count" variant="body2" fontWeight={500} color="inherit">
                                {t('projects_count', { count: projectsCount })}
                            </Typography>
                            <ChevronRightIcon fontSize="small" />
                        </Stack>
                    </Stack>
                );
            },
        },
    ];
};

export default useCategoryColumns;
