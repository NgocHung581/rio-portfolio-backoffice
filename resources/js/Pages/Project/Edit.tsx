import { PageProps } from '@/types';
import { Project, ProjectFormPageProps } from '@/types/project';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import ProjectForm from './components/ProjectForm';
import ProjectPageHeader from './components/ProjectPageHeader';

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
            <ProjectPageHeader project={project} />
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
