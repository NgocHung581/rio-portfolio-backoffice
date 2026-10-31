import { router, useForm, usePage } from '@inertiajs/react';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import useProjectListPage from '../hooks/useProjectListPage';
import { ProjectListPageProps, ProjectListPageQuery } from '../List';

type ProjectSearchFormData = Required<Pick<ProjectListPageQuery, 'category_ids' | 'keyword' | 'is_highlight'>>;

type HighlightFilterProps = {
    /** '' for every project, '1' for highlighted ones, '0' for the others. */
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    error?: string;
};

/**
 * Select box for the highlight filter. Shares the look of the other filters, with a star to tell the options apart.
 */
const HighlightFilter = ({ value, onChange, disabled, error }: HighlightFilterProps) => {
    const { t } = useTranslation();

    const options = [
        { value: '', label: t('all_projects'), icon: <StarBorderIcon fontSize="small" color="disabled" /> },
        { value: '1', label: t('highlighted_projects'), icon: <StarIcon fontSize="small" color="warning" /> },
        { value: '0', label: t('not_highlighted_projects'), icon: <StarBorderIcon fontSize="small" /> },
    ];

    return (
        <TextField
            select
            label={t('highlight')}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            error={!!error}
            helperText={error}
            slotProps={{
                // The label always sits on the border, so "All projects" reads as a choice, not as an empty field.
                inputLabel: { shrink: true },
                select: {
                    displayEmpty: true,
                    renderValue: (selected) => {
                        const option = options.find((item) => item.value === selected) ?? options[0];

                        return (
                            <Stack direction="row" alignItems="center" gap={2}>
                                {option.icon}
                                {option.label}
                            </Stack>
                        );
                    },
                },
            }}
            sx={{ width: { sm: 220 }, flexShrink: 0 }}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ gap: 2 }}>
                    {option.icon}
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

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
    const appliedIsHighlight = query.is_highlight ?? '';
    const hasAppliedFilters = !!appliedCategoryIds.length || !!appliedKeyword || appliedIsHighlight !== '';

    const { data, setData, errors, clearErrors, processing, get } = useForm<ProjectSearchFormData>({
        category_ids: appliedCategoryIds,
        keyword: appliedKeyword,
        is_highlight: appliedIsHighlight,
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
                direction={{ xs: 'column', sm: 'row' }}
                flexWrap={{ sm: 'wrap' }}
                alignItems={{ xs: 'stretch', sm: 'flex-start' }}
                gap={2}
            >
                <TextField
                    type="search"
                    name="keyword"
                    label={t('title')}
                    value={data.keyword}
                    onChange={(e) => setData('keyword', e.target.value)}
                    disabled={isBusy}
                    error={!!errors.keyword}
                    helperText={errors.keyword}
                    placeholder={t('search_projects_placeholder')}
                    slotProps={{
                        htmlInput: { 'aria-label': t('search') },
                        // The placeholder stays visible, so the label always sits on the border.
                        inputLabel: { shrink: true },
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{ flex: { sm: '1 1 260px' }, minWidth: 0 }}
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
                            label={t('category')}
                            placeholder={data.category_ids.length ? undefined : t('all_categories')}
                            error={!!errors.category_ids}
                            helperText={errors.category_ids}
                            slotProps={{
                                htmlInput: { ...params.inputProps, 'aria-label': t('category') },
                                inputLabel: { ...params.InputLabelProps, shrink: true },
                            }}
                        />
                    )}
                    sx={{ width: { sm: 280 }, flexShrink: 0 }}
                />
                <HighlightFilter
                    value={data.is_highlight}
                    onChange={(value) => setData('is_highlight', value)}
                    disabled={isBusy}
                    error={errors.is_highlight}
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
                            onDelete={() =>
                                applyFilters({
                                    category_ids: appliedCategoryIds,
                                    keyword: '',
                                    is_highlight: appliedIsHighlight,
                                })
                            }
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
                                        is_highlight: appliedIsHighlight,
                                    })
                                }
                                disabled={isBusy}
                            />
                        ))}
                    {appliedIsHighlight !== '' && (
                        <Chip
                            label={
                                appliedIsHighlight === '1' ? t('highlighted_projects') : t('not_highlighted_projects')
                            }
                            onDelete={() =>
                                applyFilters({
                                    category_ids: appliedCategoryIds,
                                    keyword: appliedKeyword,
                                    is_highlight: '',
                                })
                            }
                            disabled={isBusy}
                        />
                    )}
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => applyFilters({ category_ids: [], keyword: '', is_highlight: '' })}
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
