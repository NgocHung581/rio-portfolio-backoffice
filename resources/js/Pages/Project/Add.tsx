import { PageProps } from '@/types';
import { ProjectFormPageProps } from '@/types/project';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import ProjectForm from './components/ProjectForm';
import ProjectPageHeader from './components/ProjectPageHeader';

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
            <ProjectPageHeader />
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
