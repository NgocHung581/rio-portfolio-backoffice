import FormField from '@/Components/FormField';
import { useForm, usePage } from '@inertiajs/react';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FormEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import useCategoryListPage from '../hooks/useCategoryListPage';
import { CategoryListPageProps, CategoryListPageQuery } from '../List';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

type CategorySearchFormData = Required<Pick<CategoryListPageQuery, 'web_visibilities' | 'keyword'>>;

const CategorySearchForm = () => {
    const { t } = useTranslation();
    const { webVisibilityOptions, query } = usePage<CategoryListPageProps>().props;

    const { setIsSearching } = useCategoryListPage();

    const { data, setData, errors, clearErrors, processing, get } = useForm<CategorySearchFormData>({
        web_visibilities: query.web_visibilities ?? [],
        keyword: query.keyword ?? '',
    });

    const updateFormField = (
        name: keyof CategorySearchFormData,
        value: CategorySearchFormData[keyof CategorySearchFormData],
    ) => {
        setData(name, value);
    };

    const handleChangeWebVisibility = (value: number) => (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const clonedWebVisibilities = [...data.web_visibilities];

        if (checked) {
            updateFormField('web_visibilities', [...clonedWebVisibilities, value]);
        } else {
            updateFormField(
                'web_visibilities',
                clonedWebVisibilities.filter((webVisibility) => webVisibility !== value),
            );
        }
    };

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
        <Card component="form" onSubmit={handleSearch}>
            <CardContent>
                <Stack gap={4}>
                    <FormField
                        label={t('web_visibility')}
                        control={
                            <Fragment>
                                <FormGroup sx={{ flexDirection: 'row' }}>
                                    {webVisibilityOptions.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            control={
                                                <Checkbox
                                                    checked={data.web_visibilities.includes(option.value)}
                                                    onChange={handleChangeWebVisibility(option.value)}
                                                    disabled={processing}
                                                />
                                            }
                                            label={option.label}
                                        />
                                    ))}
                                </FormGroup>
                                {errors.web_visibilities && (
                                    <FormHelperText error>{errors.web_visibilities}</FormHelperText>
                                )}
                            </Fragment>
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
                                        information: [t('name_en'), t('name_vi')].join(', '),
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
                                onChange={(e) => updateFormField('keyword', e.target.value)}
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

export default CategorySearchForm;
