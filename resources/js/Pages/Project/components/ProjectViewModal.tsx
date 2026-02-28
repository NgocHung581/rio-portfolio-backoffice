import ProseWrapper from '@/Components/ProseWrapper';
import { PageProps } from '@/types';
import { Gallery, MediaItem, Project } from '@/types/project';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

type RenderTriggerProps = {
    openModal: () => void;
};

type ProjectInfo = Pick<
    Project,
    'title_en' | 'title_vi' | 'description_en' | 'description_vi' | 'summary_en' | 'summary_vi'
> & {
    galleries: (Pick<Gallery, 'caption'> & { media_items: Pick<MediaItem, 'file_url' | 'frame'>[] })[];
};

type Props = {
    renderTrigger: (props: RenderTriggerProps) => ReactNode;
    projectInfo: ProjectInfo;
    locale: PageProps['locale'];
};

const ProjectViewModal = ({ renderTrigger, projectInfo, locale }: Props) => {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Fragment>
            {renderTrigger({ openModal: handleOpenModal })}
            <Dialog
                scroll="body"
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="xl"
                fullWidth
                slotProps={{
                    backdrop: { sx: { backdropFilter: 'blur(4px)' } },
                    paper: { sx: { backgroundColor: 'var(--bg-content)', py: 15 } },
                }}
            >
                <Stack alignItems="center" spacing={15}>
                    <Typography variant="h4" color="primary" fontWeight={700}>
                        {projectInfo[`title_${locale}`]}
                    </Typography>
                    <ProseWrapper>
                        <Box
                            color="secondary.main"
                            dangerouslySetInnerHTML={{ __html: projectInfo[`description_${locale}`] }}
                            width={0.75}
                            mx="auto"
                        />
                    </ProseWrapper>
                    {projectInfo.galleries.map((gallery, galleryIndex) => (
                        <Stack key={galleryIndex} alignItems="center" gap={15}>
                            <Grid container spacing={1}>
                                {gallery.media_items.map((mediaItem, mediaItemIndex) => (
                                    <Grid key={mediaItemIndex} size={12 / gallery.media_items.length}>
                                        <Box
                                            component="img"
                                            src={mediaItem.file_url}
                                            sx={{ aspectRatio: mediaItem.frame }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            {!!gallery.caption && (
                                <Typography
                                    variant="caption"
                                    color="var(--mui-palette-text-caption)"
                                    fontWeight={700}
                                    width={0.75}
                                    mx="auto"
                                    textAlign="center"
                                >
                                    {gallery.caption}
                                </Typography>
                            )}
                        </Stack>
                    ))}
                    <ProseWrapper>
                        <Box
                            color="secondary.main"
                            dangerouslySetInnerHTML={{ __html: projectInfo[`summary_${locale}`] }}
                            width={0.75}
                            mx="auto"
                        />
                    </ProseWrapper>
                    <Typography textTransform="uppercase" color="primary" fontWeight={700}>
                        {t('the_end')}
                    </Typography>
                </Stack>
                <IconButton
                    disableRipple
                    sx={{
                        position: 'fixed',
                        top: 10,
                        right: 20,
                        backgroundColor: 'var(--mui-palette-action-active)',
                        color: 'white',
                        ':hover': {
                            backgroundColor:
                                'rgb(var(--mui-palette-action-activeChannel) / var(--mui-palette-action-disabledOpacity))',
                        },
                    }}
                    onClick={handleCloseModal}
                >
                    <ClearIcon fontSize="small" />
                </IconButton>
            </Dialog>
        </Fragment>
    );
};

export default ProjectViewModal;
