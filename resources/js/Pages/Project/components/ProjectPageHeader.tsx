import Image from '@/Components/Image';
import { Language } from '@/enums/language';
import WebVisibility from '@/enums/web-visibility';
import { Project } from '@/types/project';
import { Link, usePage } from '@inertiajs/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import MuiLink from '@mui/material/Link';
import { SvgIconProps } from '@mui/material/SvgIcon';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { cloneElement, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    /** The project being edited. Leave it empty on the add page. */
    project?: Project;
};

const ProjectPageHeader = ({ project }: Props) => {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const isVietnamese = locale === Language.Vietnamese;
    const pageName = project ? t('edit_project') : t('add_a_new_project');

    const renderMetaItem = (icon: ReactElement<SvgIconProps>, label: string, value: string) => (
        <Stack direction="row" alignItems="center" gap={1.5}>
            {cloneElement(icon, { fontSize: 'small', color: 'action' })}
            <Typography variant="body2" color="textSecondary">
                {label}:{' '}
                <Typography component="span" variant="body2" color="textPrimary" fontWeight={500}>
                    {value}
                </Typography>
            </Typography>
        </Stack>
    );

    const renderProjectInfo = (project: Project) => {
        const isPublic = project.web_visibility === WebVisibility.Public;
        const categoryName = isVietnamese ? project.category.name_vi : project.category.name_en;
        const updatedAt = new Intl.DateTimeFormat(isVietnamese ? 'vi-VN' : 'en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(project.updated_at));

        return (
            <Stack direction="row" flexWrap="wrap" alignItems="center" columnGap={4} rowGap={2}>
                <Stack direction="row" gap={2}>
                    <Chip
                        variant="outlined"
                        color={isPublic ? 'success' : 'error'}
                        icon={isPublic ? <PublicOutlinedIcon /> : <LockOutlinedIcon />}
                        label={t(isPublic ? 'public' : 'private')}
                    />
                    {project.is_highlight && (
                        <Chip variant="outlined" color="warning" icon={<StarOutlineIcon />} label={t('highlight')} />
                    )}
                </Stack>
                {renderMetaItem(<FolderOutlinedIcon />, t('category'), categoryName)}
                {renderMetaItem(<ScheduleOutlinedIcon />, t('last_updated'), updatedAt)}
            </Stack>
        );
    };

    return (
        <Stack component="header" gap={4}>
            <Breadcrumbs aria-label={t('breadcrumb')}>
                <MuiLink
                    component={Link}
                    href={route('projects.index')}
                    underline="hover"
                    color="textSecondary"
                    variant="body2"
                    display="inline-flex"
                    alignItems="center"
                    gap={1.5}
                >
                    <ArrowBackIcon sx={{ fontSize: 18 }} />
                    {t('list_of_projects')}
                </MuiLink>
                <Typography variant="body2" color="textPrimary" aria-current="page">
                    {pageName}
                </Typography>
            </Breadcrumbs>
            <Stack direction="row" alignItems="center" gap={{ xs: 3, sm: 5 }}>
                {!!project?.thumbnail_file_url && (
                    <Image
                        src={project.thumbnail_file_url}
                        alt=""
                        containerSx={{
                            flexShrink: 0,
                            width: { xs: 56, sm: 80 },
                            aspectRatio: '4/5',
                            overflow: 'hidden',
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'divider',
                        }}
                        imageSx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                    />
                )}
                <Stack gap={2} minWidth={0}>
                    <Typography variant="h1" sx={{ overflowWrap: 'anywhere' }}>
                        {project ? (isVietnamese ? project.title_vi : project.title_en) : pageName}
                    </Typography>
                    {project ? (
                        renderProjectInfo(project)
                    ) : (
                        <Typography color="textSecondary" maxWidth="65ch">
                            {t('add_project_description')}
                        </Typography>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default ProjectPageHeader;
