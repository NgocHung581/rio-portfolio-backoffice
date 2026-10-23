import { router, useForm, usePage } from '@inertiajs/react';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import useProjectListPage from '../hooks/useProjectListPage';
import { ProjectListPageProps, ProjectListPageQuery } from '../List';

type ProjectSearchFormData = Required<Pick<ProjectListPageQuery, 'category_ids' | 'keyword'>>;

/**
 * Compact filters placed in the toolbar of the project table, followed by the filters currently applied.
 */
const ProjectSearchForm = () => {
    const { t } = useTranslation();
    const { query, categoryOptions } = usePage<ProjectListPageProps>().props;

    const { isSearching, setIsSearching } = useProjectListPage();

    // Values from the URL are strings, while the category options use numbers.
    const appliedCategoryIds = (query.category_ids ?? []).map(Number);
    const appliedKeyword = query.keyword ?? '';
    const hasAppliedFilters = !!appliedCategoryIds.length || !!appliedKeyword;

    const { data, setData, errors, clearErrors, processing, get } = useForm<ProjectSearchFormData>({
        category_ids: appliedCategoryIds,
        keyword: appliedKeyword,
    });

    // Filters also change through the chips below, which do not go through the form.
    const isBusy = processing || isSearching;

    const visitOptions = {
        onStart: () => {
            setIsSearching(true);
            clearErrors();
        },
        onFinish: () => setIsSearching(false),
        preserveState: true,
    };

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        get(route('projects.index'), visitOptions);
    };

    const applyFilters = (filters: ProjectSearchFormData) => {
        setData(filters);
        router.get(route('projects.index'), { ...query, ...filters, page: 1 }, visitOptions);
    };

    return (
        <Stack gap={3} flex={1} minWidth={0}>
            <Stack
                component="form"
                role="search"
                onSubmit={handleSearch}
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'stretch', md: 'flex-start' }}
                gap={2}
                maxWidth={{ md: 880 }}
            >
                <TextField
                    type="search"
                    name="keyword"
                    value={data.keyword}
                    onChange={(e) => setData('keyword', e.target.value)}
                    disabled={isBusy}
                    error={!!errors.keyword}
                    helperText={errors.keyword}
                    placeholder={t('search_projects_placeholder')}
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
                    sx={{ flex: 1, minWidth: { md: 280 } }}
                />
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    limitTags={1}
                    options={categoryOptions}
                    value={categoryOptions.filter((option) => data.category_ids.includes(option.value))}
                    onChange={(_, selected) =>
                        setData(
                            'category_ids',
                            selected.map((option) => option.value),
                        )
                    }
                    disabled={isBusy}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={data.category_ids.length ? undefined : t('all_categories')}
                            error={!!errors.category_ids}
                            helperText={errors.category_ids}
                            slotProps={{ htmlInput: { ...params.inputProps, 'aria-label': t('category') } }}
                        />
                    )}
                    sx={{ width: { md: 300 }, flexShrink: 0 }}
                />
                <Button type="submit" variant="outlined" loading={isBusy} sx={{ flexShrink: 0 }}>
                    {t('search')}
                </Button>
            </Stack>

            {/* What the list is filtered by right now, each removable on its own. */}
            {hasAppliedFilters && (
                <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                    <Typography variant="body2" color="textSecondary">
                        {t('filtered_by')}
                    </Typography>
                    {!!appliedKeyword && (
                        <Chip
                            label={`"${appliedKeyword}"`}
                            onDelete={() => applyFilters({ category_ids: appliedCategoryIds, keyword: '' })}
                            disabled={isBusy}
                        />
                    )}
                    {categoryOptions
                        .filter((option) => appliedCategoryIds.includes(option.value))
                        .map((option) => (
                            <Chip
                                key={option.value}
                                label={option.label}
                                onDelete={() =>
                                    applyFilters({
                                        category_ids: appliedCategoryIds.filter((id) => id !== option.value),
                                        keyword: appliedKeyword,
                                    })
                                }
                                disabled={isBusy}
                            />
                        ))}
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => applyFilters({ category_ids: [], keyword: '' })}
                        disabled={isBusy}
                    >
                        {t('clear_filters')}
                    </Button>
                </Stack>
            )}
        </Stack>
    );
};

export default ProjectSearchForm;
