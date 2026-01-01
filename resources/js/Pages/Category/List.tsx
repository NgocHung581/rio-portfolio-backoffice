import { Option, PageProps, PaginatedData } from '@/types';
import { Category } from '@/types/category';
import { Head } from '@inertiajs/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import CategorySearchForm from './components/CategorySearchForm';
import CategoryTable from './components/CategoryTable';
import { CategoryListPageProvider } from './contexts/categoryListPageContext';
import { ChipProps } from '@mui/material/Chip';

export type CategoryListPageQuery = {
    web_visibilities?: number[];
    keyword?: string;
    page: number;
    per_page: number;
};

export type CategoryListPageProps = PageProps<{
    categories: PaginatedData<Category>;
    webVisibilityOptions: (Option & { color: ChipProps['color'] })[];
    mediaTypeOptions: Option[];
    perPageOptions: Option[];
    query: CategoryListPageQuery;
}>;

const CategoryListPage = () => {
    const { t } = useTranslation();

    return (
        <CategoryListPageProvider>
            <Stack spacing={6}>
                <Head title={t('list_of_categories')} />
                <Typography variant="h1">{t('list_of_categories')}</Typography>
                <CategorySearchForm />
                <CategoryTable />
            </Stack>
        </CategoryListPageProvider>
    );
};

export default CategoryListPage;
