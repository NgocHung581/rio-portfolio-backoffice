import { Option, PageProps, PaginatedData } from '@/types';
import { Category } from '@/types/category';
import { Project } from '@/types/project';
import { Head } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import CategoryFormModal from './components/CategoryFormModal';
import CategoryTable from './components/CategoryTable';
import { CategoryListPageProvider } from './contexts/categoryListPageContext';

export type CategoryListPageQuery = {
    keyword?: string;
    page: number;
    per_page: number;
};

export type CategoryListItem = Category & {
    projects_count: number;
    /** The most recently updated projects, for previewing their covers. */
    projects: Pick<Project, 'id' | 'title_en' | 'title_vi' | 'thumbnail_file_url'>[];
};

export type CategoryListPageProps = PageProps<{
    categories: PaginatedData<CategoryListItem>;
    mediaTypeOptions: Option[];
    perPageOptions: Option[];
    query: CategoryListPageQuery;
}>;

const CategoryListPage = () => {
    const { t } = useTranslation();

    return (
        <CategoryListPageProvider>
            <Stack gap={{ xs: 4, sm: 6 }}>
                <Head title={t('list_of_categories')} />
                <Stack
                    component="header"
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                    justifyContent="space-between"
                    gap={4}
                >
                    <Stack gap={2}>
                        <Typography variant="h1">{t('list_of_categories')}</Typography>
                        <Typography color="textSecondary" maxWidth="65ch">
                            {t('categories_description')}
                        </Typography>
                    </Stack>
                    <CategoryFormModal
                        renderTrigger={({ openModal }) => (
                            <Button startIcon={<AddIcon />} onClick={openModal} sx={{ flexShrink: 0 }}>
                                {t('add_a_new_category')}
                            </Button>
                        )}
                    />
                </Stack>
                <CategoryTable />
            </Stack>
        </CategoryListPageProvider>
    );
};

export default CategoryListPage;
