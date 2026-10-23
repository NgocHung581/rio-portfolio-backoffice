import { Language } from '@/enums/language';
import MediaType from '@/enums/media-type';
import { Link, usePage } from '@inertiajs/react';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import StarIcon from '@mui/icons-material/Star';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { CategorySummary, ProjectStatistics } from '../types';

type Props = {
    statistics: ProjectStatistics;
    categories: CategorySummary[];
};

const PortfolioOverview = ({ statistics, categories }: Props) => {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const isVietnamese = locale === Language.Vietnamese;
    const maxProjectsCount = Math.max(1, ...categories.map((category) => category.projects_count));
    const publicPercentage = statistics.total ? (statistics.public / statistics.total) * 100 : 0;

    const visibilitySegments = [
        { key: 'public', label: t('public'), count: statistics.public, color: 'success.main' },
        { key: 'private', label: t('private'), count: statistics.private, color: 'error.main' },
    ];

    return (
        <Card sx={{ height: 1 }}>
            <CardHeader title={t('portfolio_overview')} slotProps={{ title: { variant: 'h4', component: 'h2' } }} />
            <CardContent>
                <Stack gap={8}>
                    {/* How much of the portfolio visitors can see. */}
                    <Stack gap={3}>
                        <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap={4}>
                            <Typography variant="h5" component="p">
                                {t('projects_count', { count: statistics.total })}
                            </Typography>
                            {!!statistics.highlighted && (
                                <Stack direction="row" alignItems="center" gap={1} color="warning.main">
                                    <StarIcon sx={{ fontSize: 18 }} />
                                    <Typography variant="body2" color="textSecondary">
                                        {t('highlighted_projects_count', { count: statistics.highlighted })}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                        <Box
                            role="img"
                            aria-label={visibilitySegments.map(({ label, count }) => `${label}: ${count}`).join(', ')}
                            display="flex"
                            height={10}
                            borderRadius={5}
                            overflow="hidden"
                            bgcolor="action.selected"
                        >
                            {!!statistics.total && (
                                <>
                                    <Box width={`${publicPercentage}%`} bgcolor="success.main" />
                                    <Box flex={1} bgcolor="error.main" />
                                </>
                            )}
                        </Box>
                        <Stack direction="row" gap={6} flexWrap="wrap">
                            {visibilitySegments.map(({ key, label, count, color }) => (
                                <Stack key={key} direction="row" alignItems="center" gap={1.5}>
                                    <Box width={10} height={10} borderRadius="50%" bgcolor={color} />
                                    <Typography variant="body2" color="textSecondary">
                                        {label}{' '}
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            fontWeight={600}
                                            color="textPrimary"
                                        >
                                            {count}
                                        </Typography>
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>

                    {/* Which categories are well covered and which are still thin. */}
                    <Stack gap={3}>
                        <Stack direction="row" alignItems="baseline" justifyContent="space-between" gap={4}>
                            <Typography variant="h6" component="h3">
                                {t('projects_by_category')}
                            </Typography>
                            <MuiLink
                                component={Link}
                                href={route('categories.index')}
                                variant="body2"
                                underline="hover"
                            >
                                {t('manage_categories')}
                            </MuiLink>
                        </Stack>
                        {categories.length ? (
                            <Stack component="ul" gap={3} m={0} p={0} sx={{ listStyle: 'none' }}>
                                {categories.map((category) => {
                                    const isVideo = category.media_type === MediaType.Video;
                                    const classification = t(isVideo ? 'cinematography' : 'photography');

                                    return (
                                        <Stack component="li" key={category.id} gap={1}>
                                            <Stack direction="row" alignItems="center" gap={2}>
                                                <Tooltip title={classification}>
                                                    <Box
                                                        role="img"
                                                        aria-label={classification}
                                                        display="flex"
                                                        color={isVideo ? 'secondary.main' : 'primary.main'}
                                                    >
                                                        {isVideo ? (
                                                            <VideocamOutlinedIcon fontSize="small" />
                                                        ) : (
                                                            <PhotoCameraOutlinedIcon fontSize="small" />
                                                        )}
                                                    </Box>
                                                </Tooltip>
                                                <Typography variant="body2" flex={1} minWidth={0} noWrap>
                                                    {isVietnamese ? category.name_vi : category.name_en}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    color={category.projects_count ? 'textPrimary' : 'textSecondary'}
                                                >
                                                    {category.projects_count}
                                                </Typography>
                                            </Stack>
                                            <Box height={6} borderRadius={3} bgcolor="action.hover" overflow="hidden">
                                                <Box
                                                    height={1}
                                                    width={`${(category.projects_count / maxProjectsCount) * 100}%`}
                                                    borderRadius={3}
                                                    bgcolor={isVideo ? 'secondary.main' : 'primary.main'}
                                                />
                                            </Box>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                {t('no_categories_yet')}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PortfolioOverview;
