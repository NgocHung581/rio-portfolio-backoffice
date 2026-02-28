import FormField from '@/Components/FormField';
import { useForm, usePage } from '@inertiajs/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import useProjectListPage from '../hooks/useProjectListPage';
import { ProjectListPageProps, ProjectListPageQuery } from '../List';

type ProjectSearchFormData = Required<Pick<ProjectListPageQuery, 'category_ids' | 'keyword'>>;

const ProjectSearchForm = () => {
    const { t } = useTranslation();
    const { query, categoryOptions } = usePage<ProjectListPageProps>().props;

    const { setIsSearching } = useProjectListPage();

    const { data, setData, errors, clearErrors, processing, get } = useForm<ProjectSearchFormData>({
        category_ids: query.category_ids ?? [],
        keyword: query.keyword ?? '',
    });

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        get(route('projects.index'), {
            onStart: () => {
                setIsSearching(true);
                clearErrors();
            },
            onFinish: () => setIsSearching(false),
            preserveState: true,
        });
    };

    return (
        <Card component="form" onSubmit={handleSearch}>
            <CardContent>
                <Stack gap={4}>
                    <FormField
                        label={t('category')}
                        control={
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={categoryOptions}
                                value={categoryOptions.filter((option) => data.category_ids.includes(option.value))}
                                onChange={(_, selected) =>
                                    setData(
                                        'category_ids',
                                        selected.map((option) => option.value),
                                    )
                                }
                                disabled={processing}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={!!errors.category_ids}
                                        helperText={errors.category_ids}
                                    />
                                )}
                            />
                        }
                    />
                    <FormField
                        label={
                            <Typography
                                component="span"
                                fontWeight="inherit"
                                fontSize="inherit"
                                display="flex"
                                alignItems="center"
                                gap={1}
                            >
                                {t('keyword')}
                                <Tooltip
                                    title={t('search_keyword_explanation', {
                                        information: [t('title_en'), t('title_vi')].join(', '),
                                    })}
                                    placement="right"
                                >
                                    <InfoOutlinedIcon fontSize="small" />
                                </Tooltip>
                            </Typography>
                        }
                        control={
                            <TextField
                                name="keyword"
                                value={data.keyword}
                                onChange={(e) => setData('keyword', e.target.value)}
                                disabled={processing}
                                error={!!errors.keyword}
                                helperText={errors.keyword}
                            />
                        }
                    />
                </Stack>
            </CardContent>
            <CardActions>
                <Button type="submit" startIcon={<SearchIcon />} loading={processing}>
                    {t('search')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProjectSearchForm;
