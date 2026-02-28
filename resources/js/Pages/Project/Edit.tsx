import { PageProps } from '@/types';
import { Project, ProjectFormPageProps } from '@/types/project';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import ProjectForm from './components/ProjectForm';

type Props = PageProps<
    ProjectFormPageProps & {
        project: Project;
    }
>;

const EditProjectPage = ({
    categoryOptions,
    webVisibilityOptions,
    mediaFrameOptions,
    maxMediaItemsCountPerGallery,
    project,
}: Props) => {
    const { t } = useTranslation();

    return (
        <Stack gap={{ xs: 4, sm: 6 }}>
            <Head title={t('edit_project')} />
            <Typography variant="h1">{t('edit_project')}</Typography>
            <ProjectForm
                categoryOptions={categoryOptions}
                webVisibilityOptions={webVisibilityOptions}
                mediaFrameOptions={mediaFrameOptions}
                maxMediaItemsCountPerGallery={maxMediaItemsCountPerGallery}
                project={project}
            />
        </Stack>
    );
};

export default EditProjectPage;
