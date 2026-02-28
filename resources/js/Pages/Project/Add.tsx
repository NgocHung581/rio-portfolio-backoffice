import { PageProps } from '@/types';
import { ProjectFormPageProps } from '@/types/project';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import ProjectForm from './components/ProjectForm';

type Props = PageProps<ProjectFormPageProps>;

const AddProjectPage = ({
    categoryOptions,
    webVisibilityOptions,
    mediaFrameOptions,
    maxMediaItemsCountPerGallery,
}: Props) => {
    const { t } = useTranslation();

    return (
        <Stack gap={{ xs: 4, sm: 6 }}>
            <Head title={t('add_a_new_project')} />
            <Typography variant="h1">{t('add_a_new_project')}</Typography>
            <ProjectForm
                categoryOptions={categoryOptions}
                webVisibilityOptions={webVisibilityOptions}
                mediaFrameOptions={mediaFrameOptions}
                maxMediaItemsCountPerGallery={maxMediaItemsCountPerGallery}
            />
        </Stack>
    );
};

export default AddProjectPage;
