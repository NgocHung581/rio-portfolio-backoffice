import FileDropzone, { UploadedFile } from '@/@core/components/FileDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import FormField from '@/Components/FormField';
import MediaType from '@/enums/media-type';
import { PageProps } from '@/types';
import { ProjectFormPageProps } from '@/types/project';
import { Head, useForm } from '@inertiajs/react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import MediaItemCard from './components/MediaItemCard';

type AddProjectPageProps = PageProps<ProjectFormPageProps>;

type ProjectFormErrorKeys =
    | `thumbnail.${string}`
    | `galleries.${string | number}`
    | `galleries.${string | number}.${string}`
    | `galleries.${string | number}.${string}.${string | number}`
    | `galleries.${string | number}.${string}.${string | number}.${string}`;

type ProjectThumbnailData = UploadedFile & {
    frame: string;
};

type GalleryMediaItemData = UploadedFile & {
    key: string | number;
    frame: string;
    is_banner: boolean;
};

type GalleryData = {
    key: string | number;
    media_items: GalleryMediaItemData[];
    caption: string;
};

export type ProjectFormData = {
    category_id: number | null;
    title_en: string;
    title_vi: string;
    description_en: string;
    description_vi: string;
    summary_en: string;
    summary_vi: string;
    is_highlight: boolean;
    web_visibility: string;
    thumbnail: ProjectThumbnailData | undefined;
    galleries: GalleryData[];
} & Partial<Record<ProjectFormErrorKeys, string>>;

const AddProjectPage = ({
    categoryOptions,
    webVisibilityOptions,
    mediaFrameOptions,
    maxMediaItemsCountPerGallery,
}: AddProjectPageProps) => {
    const { t } = useTranslation();

    const { data, setData, errors, setError, clearErrors, post, processing } = useForm<ProjectFormData>({
        category_id: null,
        title_en: '',
        title_vi: '',
        description_en: '',
        description_vi: '',
        summary_en: '',
        summary_vi: '',
        is_highlight: false,
        web_visibility: webVisibilityOptions[0].value.toString(),
        thumbnail: undefined,
        galleries: [{ key: uuidv4(), media_items: [], caption: '' }],
    });

    const thumbnailMineTypes: string[] = import.meta.env.VITE_APP_IMAGE_MINE_TYPES?.split(',') ?? [];
    const mediaSetting = useMemo(() => {
        const foundCategory = categoryOptions.find((category) => category.value === data.category_id);

        if (!foundCategory) return { mineTypes: [], maxFileSize: undefined };

        if (foundCategory.media_type === MediaType.Image) {
            return {
                mineTypes: import.meta.env.VITE_APP_IMAGE_MINE_TYPES?.split(',') ?? [],
                maxFileSize: Number(import.meta.env.VITE_APP_IMAGE_SIZE_LIMIT),
            };
        }

        if (foundCategory.media_type === MediaType.Video) {
            return {
                mineTypes: import.meta.env.VITE_APP_VIDEO_MINE_TYPES?.split(',') ?? [],
                maxFileSize: Number(import.meta.env.VITE_APP_VIDEO_SIZE_LIMIT),
            };
        }

        return { mineTypes: [], maxFileSize: undefined };
    }, [data.category_id]);

    const handleUploadThumbnail = (uploadedFile: UploadedFile) => {
        clearErrors('thumbnail');
        setData('thumbnail', { ...uploadedFile, frame: mediaFrameOptions[0].value });
    };

    const handleChangeThumbnailFrame = (frame: string) => {
        if (!data.thumbnail) return;

        setData('thumbnail', { ...data.thumbnail, frame });
    };

    const handleAddGallery = () => {
        setData('galleries', [...data.galleries, { key: uuidv4(), media_items: [], caption: '' }]);
    };

    const handleDeleteGallery = (galleryKey: string | number) => {
        setData(
            'galleries',
            data.galleries.filter((gallery) => gallery.key !== galleryKey),
        );
    };

    const handleUploadGalleryMediaItems = (galleryKey: string | number, uploadedFiles: UploadedFile[]) => {
        clearErrors(`galleries.${galleryKey}.media_items`);

        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.key === galleryKey);

        if (foundGalleryIndex === -1) return;

        const foundGallery = data.galleries[foundGalleryIndex];
        const totalMediaItemsCount = foundGallery.media_items.length + uploadedFiles.length;

        if (totalMediaItemsCount > maxMediaItemsCountPerGallery) {
            setError(
                `galleries.${foundGallery.key}.media_items`,
                t('messages.too_many_files', {
                    max: maxMediaItemsCountPerGallery,
                    count: maxMediaItemsCountPerGallery,
                }),
            );

            return;
        }

        const mediaItems = [
            ...foundGallery.media_items,
            ...uploadedFiles.map<GalleryMediaItemData>((file) => ({
                ...file,
                key: uuidv4(),
                frame: mediaFrameOptions[0].value,
                is_banner: false,
            })),
        ];

        setData('galleries', data.galleries.with(foundGalleryIndex, { ...foundGallery, media_items: mediaItems }));
    };

    const updateGalleryMediaItemField = <T extends keyof Pick<GalleryMediaItemData, 'frame' | 'is_banner'>>(
        galleryKey: string | number,
        mediaItemKey: string | number,
        field: T,
        value: GalleryMediaItemData[T],
    ) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.key === galleryKey);

        if (foundGalleryIndex === -1) return;

        const foundGallery = data.galleries[foundGalleryIndex];

        setData(
            'galleries',
            data.galleries.with(foundGalleryIndex, {
                ...foundGallery,
                media_items: foundGallery.media_items.map((mediaItem) =>
                    mediaItem.key === mediaItemKey ? { ...mediaItem, [field]: value } : mediaItem,
                ),
            }),
        );
    };

    const handleDeleteGalleryMediaItem = (galleryKey: string | number, mediaItemKey: string | number) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.key === galleryKey);

        if (foundGalleryIndex === -1) return;

        const foundGallery = data.galleries[foundGalleryIndex];

        setData(
            'galleries',
            data.galleries.with(foundGalleryIndex, {
                ...foundGallery,
                media_items: foundGallery.media_items.filter((mediaItem) => mediaItem.key !== mediaItemKey),
            }),
        );
    };

    const handleChangeGalleryCaption = (galleryKey: string | number, caption: string) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.key === galleryKey);

        if (foundGalleryIndex === -1) return;

        setData(
            'galleries',
            data.galleries.with(foundGalleryIndex, {
                ...data.galleries[foundGalleryIndex],
                caption,
            }),
        );
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('projects.store'), {
            onStart: () => clearErrors(),
            onSuccess: ({ props: { message } }) => toast.success(message),
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Stack gap={{ xs: 4, sm: 6 }}>
            <Head title={t('add_a_new_project')} />
            <Typography variant="h1">{t('add_a_new_project')}</Typography>
            <Card component="form" onSubmit={handleSubmit} sx={{ overflow: 'visible', position: 'relative' }}>
                <CardHeader title={t('basic_information')} slotProps={{ title: { variant: 'h3' } }} />
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <Autocomplete
                                        options={categoryOptions}
                                        value={
                                            categoryOptions.find((option) => option.value === data.category_id) ?? null
                                        }
                                        onChange={(_, selected) => setData('category_id', selected?.value ?? null)}
                                        disabled={processing}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors.category_id}
                                                helperText={errors.category_id}
                                            />
                                        )}
                                    />
                                }
                                direction="column"
                                label={t('category')}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} container spacing={4}>
                            <Grid size={{ xs: 6 }}>
                                <FormField
                                    control={
                                        <Fragment>
                                            <RadioGroup
                                                value={data.web_visibility}
                                                onChange={(_, selected) => setData('web_visibility', selected)}
                                                sx={{ flexDirection: 'row' }}
                                            >
                                                {webVisibilityOptions.map((option) => (
                                                    <FormControlLabel
                                                        key={option.value}
                                                        value={option.value}
                                                        control={<Radio />}
                                                        label={option.label}
                                                        disabled={processing}
                                                    />
                                                ))}
                                            </RadioGroup>
                                            {!!errors.web_visibility && (
                                                <FormHelperText error>{errors.web_visibility}</FormHelperText>
                                            )}
                                        </Fragment>
                                    }
                                    label={t('web_visibility')}
                                    direction="column"
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <FormField
                                    control={
                                        <Fragment>
                                            <Checkbox
                                                edge="start"
                                                checked={data.is_highlight}
                                                onChange={(_, checked) => setData('is_highlight', checked)}
                                                disabled={processing}
                                            />
                                            {!!errors.is_highlight && (
                                                <FormHelperText error>{errors.is_highlight}</FormHelperText>
                                            )}
                                        </Fragment>
                                    }
                                    label={t('highlight')}
                                    direction="column"
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TextField
                                        value={data.title_en}
                                        onChange={(e) => setData('title_en', e.target.value)}
                                        disabled={processing}
                                        error={!!errors.title_en}
                                        helperText={errors.title_en}
                                    />
                                }
                                label={t('title_en')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TextField
                                        value={data.title_vi}
                                        onChange={(e) => setData('title_vi', e.target.value)}
                                        disabled={processing}
                                        error={!!errors.title_vi}
                                        helperText={errors.title_vi}
                                    />
                                }
                                label={t('title_vi')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TiptapEditor
                                        characterLimit={5000}
                                        value={data.description_en}
                                        onChange={(content) => setData('description_en', content)}
                                        disabled={processing}
                                        error={!!errors.description_en}
                                        helperText={errors.description_en}
                                    />
                                }
                                label={t('description_en')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TiptapEditor
                                        characterLimit={5000}
                                        value={data.description_vi}
                                        onChange={(content) => setData('description_vi', content)}
                                        disabled={processing}
                                        error={!!errors.description_vi}
                                        helperText={errors.description_vi}
                                    />
                                }
                                label={t('description_vi')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TiptapEditor
                                        characterLimit={5000}
                                        value={data.summary_en}
                                        onChange={(content) => setData('summary_en', content)}
                                        disabled={processing}
                                        error={!!errors.summary_en}
                                        helperText={errors.summary_en}
                                    />
                                }
                                label={t('summary_en')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TiptapEditor
                                        characterLimit={5000}
                                        value={data.summary_vi}
                                        onChange={(content) => setData('summary_vi', content)}
                                        disabled={processing}
                                        error={!!errors.summary_vi}
                                        helperText={errors.summary_vi}
                                    />
                                }
                                label={t('summary_vi')}
                                required
                                direction="column"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider sx={{ my: 4 }} />
                <CardHeader title={t('thumbnail')} slotProps={{ title: { variant: 'h3' } }} />
                <CardContent>
                    <Stack gap={4}>
                        <Box>
                            <FormField
                                control={
                                    <FileDropzone
                                        maxFileSize={Number(import.meta.env.VITE_APP_IMAGE_SIZE_LIMIT)}
                                        accept={Object.fromEntries(
                                            thumbnailMineTypes.map((mineType) => [mineType, []]),
                                        )}
                                        file={data.thumbnail}
                                        onUpload={handleUploadThumbnail}
                                        disabled={processing}
                                        onError={(message) => setError('thumbnail', message)}
                                        hasError={!!errors.thumbnail}
                                    />
                                }
                                label={t('file')}
                                required
                                direction="column"
                            />
                            {!!errors.thumbnail && <FormHelperText error>{errors.thumbnail}</FormHelperText>}
                        </Box>
                        {!!data.thumbnail && (
                            <Stack width={{ xs: 1, sm: 0.8, md: 0.5 }} gap={4} alignSelf="center">
                                <MediaItemCard
                                    frame={data.thumbnail.frame}
                                    onChangeFrame={handleChangeThumbnailFrame}
                                    disabled={processing}
                                    frameFieldError={errors['thumbnail.frame']}
                                    mediaItem={data.thumbnail}
                                    onDelete={() => setData('thumbnail', undefined)}
                                />
                            </Stack>
                        )}
                    </Stack>
                </CardContent>
                <Divider sx={{ my: 4 }} />
                <CardHeader title={t('galleries')} slotProps={{ title: { variant: 'h3' } }} />
                <CardContent>
                    <Stack gap={4}>
                        {data.galleries.map((gallery, index) => (
                            <Card key={gallery.key} variant="outlined">
                                <CardHeader
                                    disableTypography
                                    title={
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            gap={4}
                                        >
                                            <Typography variant="h4">{`#${index + 1}`}</Typography>
                                            <Button
                                                color="error"
                                                onClick={() => handleDeleteGallery(gallery.key)}
                                                disabled={processing}
                                            >
                                                {t('delete')}
                                            </Button>
                                        </Stack>
                                    }
                                />
                                <CardContent>
                                    <Stack gap={4}>
                                        <Box>
                                            <FormField
                                                control={
                                                    <FileDropzone
                                                        multiple
                                                        maxFileSize={mediaSetting?.maxFileSize}
                                                        accept={Object.fromEntries(
                                                            mediaSetting.mineTypes.map((mineType: string[]) => [
                                                                mineType,
                                                                [],
                                                            ]),
                                                        )}
                                                        maxFiles={maxMediaItemsCountPerGallery}
                                                        files={gallery.media_items}
                                                        onUpload={(selected) =>
                                                            handleUploadGalleryMediaItems(gallery.key, selected)
                                                        }
                                                        disabled={processing || !data.category_id}
                                                        onError={(message) =>
                                                            setError(`galleries.${gallery.key}.media_items`, message)
                                                        }
                                                        hasError={!!errors[`galleries.${gallery.key}.media_items`]}
                                                    />
                                                }
                                                label={t('file')}
                                                required
                                                direction="column"
                                            />
                                            {!!errors[`galleries.${gallery.key}.media_items`] && (
                                                <FormHelperText error>
                                                    {errors[`galleries.${gallery.key}.media_items`]}
                                                </FormHelperText>
                                            )}
                                            {!data.category_id && (
                                                <FormHelperText>
                                                    {t('messages.must_select_category_before_uploading_media')}
                                                </FormHelperText>
                                            )}
                                        </Box>
                                        {!!gallery.media_items.length && (
                                            <Grid container spacing={2}>
                                                {gallery.media_items.map((mediaItem) => (
                                                    <Grid key={mediaItem.key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                                        <MediaItemCard
                                                            frame={mediaItem.frame}
                                                            onChangeFrame={(frame) =>
                                                                updateGalleryMediaItemField(
                                                                    gallery.key,
                                                                    mediaItem.key,
                                                                    'frame',
                                                                    frame,
                                                                )
                                                            }
                                                            mediaItem={mediaItem}
                                                            onDelete={() =>
                                                                handleDeleteGalleryMediaItem(gallery.key, mediaItem.key)
                                                            }
                                                            frameFieldError={
                                                                errors[
                                                                    `galleries.${gallery.key}.media_items.${mediaItem.key}.frame`
                                                                ]
                                                            }
                                                            fileError={
                                                                errors[
                                                                    `galleries.${gallery.key}.media_items.${mediaItem.key}.file`
                                                                ]
                                                            }
                                                            disabled={processing}
                                                            showBannerVisibilityCheckbox
                                                            isBanner={mediaItem.is_banner}
                                                            onChangeIsBanner={(isBanner) =>
                                                                updateGalleryMediaItemField(
                                                                    gallery.key,
                                                                    mediaItem.key,
                                                                    'is_banner',
                                                                    isBanner,
                                                                )
                                                            }
                                                            isBannerFieldError={
                                                                errors[
                                                                    `galleries.${gallery.key}.media_items.${mediaItem.key}.is_banner`
                                                                ]
                                                            }
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </Stack>
                                </CardContent>
                                <CardActions>
                                    <Box width={{ xs: 1, lg: 0.5 }}>
                                        <FormField
                                            control={
                                                <TextField
                                                    multiline
                                                    maxRows={4}
                                                    value={gallery.caption}
                                                    onChange={(e) =>
                                                        handleChangeGalleryCaption(gallery.key, e.target.value)
                                                    }
                                                    disabled={processing}
                                                    error={!!errors[`galleries.${gallery.key}.caption`]}
                                                    helperText={errors[`galleries.${gallery.key}.caption`]}
                                                />
                                            }
                                            label={t('caption')}
                                            direction="column"
                                        />
                                    </Box>
                                </CardActions>
                            </Card>
                        ))}
                        <Box textAlign="center">
                            <Button
                                variant="text"
                                startIcon={<AddCircleOutlineOutlinedIcon />}
                                onClick={handleAddGallery}
                                disabled={processing}
                            >
                                {t('add')}
                            </Button>
                        </Box>
                    </Stack>
                </CardContent>
                <CardActions
                    sx={{
                        justifyContent: 'center',
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor: 'background.paper',
                        borderTop: 1,
                        borderColor: 'divider',
                        borderBottomLeftRadius: 'inherit',
                        borderBottomRightRadius: 'inherit',
                    }}
                >
                    <Button type="submit" loading={processing}>
                        {t('save')}
                    </Button>
                </CardActions>
            </Card>
        </Stack>
    );
};

export default AddProjectPage;
