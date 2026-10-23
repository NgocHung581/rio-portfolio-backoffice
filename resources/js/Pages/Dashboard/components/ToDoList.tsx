import Image from '@/Components/Image';
import { Language } from '@/enums/language';
import { Link, usePage } from '@inertiajs/react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectSummary, WebsiteContentStatus } from '../types';

type Props = {
    privateProjects: ProjectSummary[];
    privateProjectsCount: number;
    websiteContent: WebsiteContentStatus;
};

type ToDoItem = {
    key: string;
    href: string;
    leading: ReactNode;
    title: string;
    reason: string;
    isUrgent?: boolean;
};

const ToDoList = ({ privateProjects, privateProjectsCount, websiteContent }: Props) => {
    const { t } = useTranslation();
    const { locale } = usePage().props;
    const isVietnamese = locale === Language.Vietnamese;
    const websiteContentHref = route('settings.websiteContent.index');

    const renderIcon = (icon: ReactNode) => (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={40}
            height={40}
            borderRadius={1}
            bgcolor="action.hover"
            color="text.secondary"
        >
            {icon}
        </Box>
    );

    const items: ToDoItem[] = [
        // Website content first: it shows on every page of the website.
        ...(!websiteContent.has_avatar
            ? [
                  {
                      key: 'avatar',
                      href: websiteContentHref,
                      leading: renderIcon(<AccountCircleOutlinedIcon />),
                      title: t('missing_avatar'),
                      reason: t('website_content_setting'),
                      isUrgent: true,
                  },
              ]
            : []),
        ...(!websiteContent.has_introduction
            ? [
                  {
                      key: 'introduction',
                      href: websiteContentHref,
                      leading: renderIcon(<ArticleOutlinedIcon />),
                      title: t('missing_introduction'),
                      reason: t('website_content_setting'),
                      isUrgent: true,
                  },
              ]
            : []),
        ...(!websiteContent.partner_logos_count
            ? [
                  {
                      key: 'partner-logos',
                      href: websiteContentHref,
                      leading: renderIcon(<HandshakeOutlinedIcon />),
                      title: t('missing_partner_logos'),
                      reason: t('website_content_setting'),
                  },
              ]
            : []),
        ...privateProjects.map((project) => ({
            key: `project-${project.id}`,
            href: route('projects.edit', project.id),
            leading: (
                <Image
                    src={project.thumbnail_file_url}
                    alt=""
                    containerSx={{ width: 40, aspectRatio: '4/5', borderRadius: 0.75, overflow: 'hidden' }}
                    imageSx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                />
            ),
            title: isVietnamese ? project.title_vi : project.title_en,
            reason: project.media_items_count ? t('reason_hidden_on_website') : t('reason_no_media'),
            isUrgent: !project.media_items_count,
        })),
    ];
    const moreProjectsCount = privateProjectsCount - privateProjects.length;

    return (
        <Card sx={{ height: 1 }}>
            <CardHeader
                title={t('to_do')}
                subheader={t('to_do_description')}
                slotProps={{ title: { variant: 'h4', component: 'h2' }, subheader: { variant: 'body2' } }}
            />
            <CardContent>
                {items.length ? (
                    <Stack component="ul" m={0} p={0} sx={{ listStyle: 'none' }}>
                        {items.map((item) => (
                            <Box component="li" key={item.key}>
                                <Stack
                                    component={Link}
                                    href={item.href}
                                    direction="row"
                                    alignItems="center"
                                    gap={3}
                                    mx={-2}
                                    px={2}
                                    py={2}
                                    borderRadius={1}
                                    color="inherit"
                                    sx={{
                                        textDecoration: 'none',
                                        '&:hover': { bgcolor: 'action.hover' },
                                        '&:focus-visible': {
                                            outline: '2px solid var(--mui-palette-primary-main)',
                                            outlineOffset: -2,
                                        },
                                    }}
                                >
                                    <Box flexShrink={0}>{item.leading}</Box>
                                    <Box flex={1} minWidth={0}>
                                        <Typography variant="body2" fontWeight={500} noWrap>
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            component="p"
                                            color={item.isUrgent ? 'warning.dark' : 'textSecondary'}
                                        >
                                            {item.reason}
                                        </Typography>
                                    </Box>
                                    <ChevronRightIcon fontSize="small" color="action" />
                                </Stack>
                            </Box>
                        ))}
                        {moreProjectsCount > 0 && (
                            <Typography component="li" variant="body2" color="textSecondary" mt={2}>
                                {t('more_private_projects', { count: moreProjectsCount })}
                            </Typography>
                        )}
                    </Stack>
                ) : (
                    <Stack alignItems="center" textAlign="center" gap={2} py={6} color="success.main">
                        <CheckCircleOutlineIcon fontSize="large" />
                        <Typography variant="body2" color="textSecondary" maxWidth={320}>
                            {t('all_done')}
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};

export default ToDoList;
