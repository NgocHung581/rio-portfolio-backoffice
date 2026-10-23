import { useForm, usePage } from '@inertiajs/react';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import useCategoryListPage from '../hooks/useCategoryListPage';
import { CategoryListPageProps, CategoryListPageQuery } from '../List';

type CategorySearchFormData = Required<Pick<CategoryListPageQuery, 'keyword'>>;

/**
 * A compact search by name, placed in the toolbar of the category table.
 */
const CategorySearchForm = () => {
    const { t } = useTranslation();
    const { query } = usePage<CategoryListPageProps>().props;

    const { setIsSearching } = useCategoryListPage();

    const { data, setData, errors, clearErrors, processing, get } = useForm<CategorySearchFormData>({
        keyword: query.keyword ?? '',
    });

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        get(route('categories.index'), {
            onStart: () => {
                setIsSearching(true);
                clearErrors();
            },
            onFinish: () => setIsSearching(false),
            preserveState: true,
        });
    };

    return (
        <Stack
            component="form"
            role="search"
            onSubmit={handleSearch}
            direction="row"
            alignItems="flex-start"
            gap={2}
            width={{ xs: 1, sm: 420 }}
        >
            <TextField
                type="search"
                name="keyword"
                value={data.keyword}
                onChange={(e) => setData('keyword', e.target.value)}
                disabled={processing}
                error={!!errors.keyword}
                helperText={errors.keyword}
                placeholder={t('search_categories_placeholder')}
                slotProps={{
                    htmlInput: { 'aria-label': t('search') },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <Button type="submit" variant="outlined" loading={processing} sx={{ flexShrink: 0 }}>
                {t('search')}
            </Button>
        </Stack>
    );
};

export default CategorySearchForm;
