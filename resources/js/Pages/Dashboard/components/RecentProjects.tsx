import Image from '@/Components/Image';
import { Language } from '@/enums/language';
import MediaType from '@/enums/media-type';
import WebVisibility from '@/enums/web-visibility';
import { formatRelativeTime } from '@/utils/date';
import { Link, usePage } from '@inertiajs/react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import StarIcon from '@mui/icons-material/Star';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { ProjectSummary } from '../types';

type Props = {
    projects: ProjectSummary[];
};

const badgeSx = {
    display: 'flex',
    p: 1,
    borderRadius: '50%',
    bgcolor: 'background.paper',
    boxShadow: 1,
} as const;

/**
 * The covers of the most recently edited projects, in the same 4:5 frame they are shown in on the website.
 */
const RecentProjects = ({ projects }: Props) => {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const isVietnamese = locale === Language.Vietnamese;
    const dateTimeFormat = new Intl.DateTimeFormat(isVietnamese ? 'vi-VN' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
    const formatDateTime = (date: string) => dateTimeFormat.format(new Date(date));

    return (
        <Stack component="section" aria-labelledby="recent-projects-heading" gap={4}>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap={4} flexWrap="wrap">
                <Typography id="recent-projects-heading" variant="h4" component="h2">
                    {t('recently_edited')}
                </Typography>
                {!!projects.length && (
                    <MuiLink component={Link} href={route('projects.index')} variant="body2" underline="hover">
                        {t('view_all_projects')}
                    </MuiLink>
                )}
            </Stack>

            {projects.length ? (
                <Box
                    component="ul"
                    display="grid"
                    gap={{ xs: 3, sm: 4 }}
                    m={0}
                    p={0}
                    sx={{
                        listStyle: 'none',
                        gridTemplateColumns: {
                            xs: 'repeat(2, minmax(0, 1fr))',
                            sm: 'repeat(3, minmax(0, 1fr))',
                            lg: 'repeat(6, minmax(0, 1fr))',
                        },
                    }}
                >
                    {projects.map((project) => {
                        const isPublic = project.web_visibility === WebVisibility.Public;
                        const isVideo = project.category_media_type === MediaType.Video;
                        const title = isVietnamese ? project.title_vi : project.title_en;

                        return (
                            <Box component="li" key={project.id}>
                                <Box
                                    component={Link}
                                    href={route('projects.edit', project.id)}
                                    display="block"
                                    color="inherit"
                                    sx={{
                                        textDecoration: 'none',
                                        borderRadius: 1,
                                        '&:focus-visible': {
                                            outline: '2px solid var(--mui-palette-primary-main)',
                                            outlineOffset: 4,
                                        },
                                        '&:hover .recent-project-cover': { boxShadow: 6 },
                                    }}
                                >
                                    <Box
                                        className="recent-project-cover"
                                        position="relative"
                                        overflow="hidden"
                                        borderRadius={1}
                                        bgcolor="action.selected"
                                        boxShadow={1}
                                        sx={{ transition: (theme) => theme.transitions.create('box-shadow') }}
                                    >
                                        <Image
                                            src={project.thumbnail_file_url}
                                            alt=""
                                            containerSx={{ aspectRatio: '4/5' }}
                                            imageSx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                                        />
                                        <Stack direction="row" gap={1.5} position="absolute" top={8} right={8}>
                                            {project.is_highlight && (
                                                <Tooltip title={t('highlight')}>
                                                    <Box
                                                        sx={badgeSx}
                                                        color="warning.main"
                                                        role="img"
                                                        aria-label={t('highlight')}
                                                    >
                                                        <StarIcon sx={{ fontSize: 16 }} />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                            <Tooltip title={t(isPublic ? 'public' : 'private')}>
                                                <Box
                                                    sx={badgeSx}
                                                    color={isPublic ? 'success.main' : 'error.main'}
                                                    role="img"
                                                    aria-label={t(isPublic ? 'public' : 'private')}
                                                >
                                                    {isPublic ? (
                                                        <PublicOutlinedIcon sx={{ fontSize: 16 }} />
                                                    ) : (
                                                        <LockOutlinedIcon sx={{ fontSize: 16 }} />
                                                    )}
                                                </Box>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
                                    {/* Two lines are always reserved, so the rows below line up across covers. */}
                                    <Typography
                                        mt={3}
                                        fontWeight={600}
                                        lineHeight={1.4}
                                        minHeight="2.8em"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={1}
                                        mt={1.5}
                                        color={isVideo ? 'secondary.main' : 'primary.main'}
                                    >
                                        {isVideo ? (
                                            <VideocamOutlinedIcon sx={{ fontSize: 16 }} />
                                        ) : (
                                            <PhotoCameraOutlinedIcon sx={{ fontSize: 16 }} />
                                        )}
                                        <Typography variant="body2" fontWeight={500} color="inherit" noWrap>
                                            {isVietnamese ? project.category_name_vi : project.category_name_en}
                                        </Typography>
                                    </Stack>
                                    <Tooltip title={formatDateTime(project.updated_at)} placement="bottom-start">
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            gap={1}
                                            mt={0.5}
                                            color="text.disabled"
                                            width="fit-content"
                                        >
                                            <ScheduleOutlinedIcon sx={{ fontSize: 14 }} />
                                            <Typography
                                                component="time"
                                                dateTime={project.updated_at}
                                                variant="caption"
                                                color="textSecondary"
                                            >
                                                {t('updated_time', {
                                                    time: formatRelativeTime(project.updated_at, locale),
                                                })}
                                            </Typography>
                                        </Stack>
                                    </Tooltip>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            ) : (
                <Stack
                    alignItems="center"
                    textAlign="center"
                    gap={3}
                    py={10}
                    px={4}
                    border={2}
                    borderColor="divider"
                    borderRadius={1}
                    sx={{ borderStyle: 'dashed' }}
                >
                    <Typography color="textSecondary" maxWidth={420}>
                        {t('no_projects_yet')}
                    </Typography>
                    <Button LinkComponent={Link} href={route('projects.create')} startIcon={<AddOutlinedIcon />}>
                        {t('add_a_new_project')}
                    </Button>
                </Stack>
            )}
        </Stack>
    );
};

export default RecentProjects;
