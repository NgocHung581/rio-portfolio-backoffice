import FileDropzone from '@/@core/components/FileDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import FormField from '@/Components/FormField';
import Image from '@/Components/Image';
import MediaType, { MediaTypeValue } from '@/enums/media-type';
import { Option } from '@/types';
import { Project } from '@/types/project';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent, Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import ProjectViewModal from './ProjectViewModal';

type Props = {
    webVisibilityOptions: Option[];
    categoryOptions: (Option & { media_type: MediaTypeValue })[];
    mediaFrameOptions: Option<string>[];
    maxMediaItemsCountPerGallery: number;
    project?: Project;
};

type ProjectFormErrorKeys =
    | 'thumbnail_file'
    | `galleries.${string | number}`
    | `galleries.${string | number}.${string}`
    | `galleries.${string | number}.${string}.${string | number}`
    | `galleries.${string | number}.${string}.${string | number}.${string}`;

type GalleryMediaItemData = {
    id: string | number;
    file_url: string;
    frame: string;
    is_banner: boolean;
};

type GalleryData = {
    id: string | number;
    media_items: GalleryMediaItemData[];
    caption: string;
};

type ProjectFormData = {
    category_id: number | null;
    title_en: string;
    title_vi: string;
    description_en: string;
    description_vi: string;
    summary_en: string;
    summary_vi: string;
    is_highlight: boolean;
    web_visibility: string;
    thumbnail_file_url: string;
    galleries: GalleryData[];
} & Partial<Record<ProjectFormErrorKeys, string>>;

const ProjectForm = ({
    categoryOptions,
    maxMediaItemsCountPerGallery,
    mediaFrameOptions,
    webVisibilityOptions,
    project,
}: Props) => {
    const { t } = useTranslation();
    const { locale } = usePage().props;

    const { data, setData, errors, setError, clearErrors, post, processing } = useForm<ProjectFormData>({
        category_id: project?.category_id ?? null,
        title_en: project?.title_en ?? '',
        title_vi: project?.title_vi ?? '',
        description_en: project?.description_en ?? '',
        description_vi: project?.description_vi ?? '',
        summary_en: project?.summary_en ?? '',
        summary_vi: project?.summary_vi ?? '',
        is_highlight: project?.is_highlight ?? false,
        web_visibility: (project?.web_visibility ?? webVisibilityOptions[0].value).toString(),
        thumbnail_file_url: project?.thumbnail_file_url ?? '',
        galleries: project
            ? project.galleries.map<GalleryData>((gallery) => ({
                  id: gallery.id,
                  caption: gallery.caption ?? '',
                  media_items: gallery.media_items.map((mediaItem) => ({
                      id: mediaItem.id,
                      file_url: mediaItem.file_url,
                      frame: mediaItem.frame,
                      is_banner: mediaItem.is_banner,
                  })),
              }))
            : [],
    });
    const [uploadThumbnailPercentage, setUploadThumbnailPercentage] = useState<number | undefined>(undefined);
    const [uploadMediaItemPercentage, setUploadMediaItemPercentage] = useState<{
        galleryId: string | number | undefined;
        value: number | undefined;
    }>({ galleryId: undefined, value: undefined });

    const selectedCategory = categoryOptions.find((option) => option.value === data.category_id);
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

    const handleUploadThumbnail = (uploadedFile: File) => {
        router.post(
            route('files.upload'),
            { file: uploadedFile },
            {
                showProgress: false,
                preserveScroll: true,
                preserveUrl: true,
                preserveState: true,
                onProgress: (e) => setUploadThumbnailPercentage(e?.percentage),
                onStart: () => {
                    setData('thumbnail_file_url', '');
                    clearErrors('thumbnail_file', 'thumbnail_file_url');
                },
                onFinish: () => setUploadThumbnailPercentage(undefined),
                onSuccess: (page) => setData('thumbnail_file_url', page.props.flash['fileUrl'] as string),
                onError: (error) => toast.error(error.message),
            },
        );
    };

    const handleAddGallery = () => {
        setData('galleries', [...data.galleries, { id: uuidv4(), media_items: [], caption: '' }]);
    };

    const handleDeleteGallery = (galleryId: string | number) => {
        setData(
            'galleries',
            data.galleries.filter((gallery) => gallery.id !== galleryId),
        );
    };

    const handleUploadGalleryMediaItem = (galleryId: string | number, uploadedFile: File) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.id === galleryId);

        if (foundGalleryIndex === -1) return;

        const foundGallery = data.galleries[foundGalleryIndex];

        router.post(
            route('files.upload'),
            { file: uploadedFile },
            {
                showProgress: false,
                preserveScroll: true,
                preserveUrl: true,
                preserveState: true,
                onProgress: (e) => setUploadMediaItemPercentage({ galleryId, value: e?.percentage }),
                onStart: () => clearErrors(`galleries.${galleryId}.media_items`),
                onFinish: () => setUploadMediaItemPercentage({ galleryId: undefined, value: undefined }),
                onSuccess: (page) => {
                    const mediaItems: GalleryMediaItemData[] = [
                        ...foundGallery.media_items,
                        {
                            id: uuidv4(),
                            file_url: page.props.flash['fileUrl'] as string,
                            frame: mediaFrameOptions[0].value,
                            is_banner: false,
                        },
                    ];

                    setData(
                        'galleries',
                        data.galleries.with(foundGalleryIndex, { ...foundGallery, media_items: mediaItems }),
                    );
                },
                onError: (error) => toast.error(error.message),
            },
        );
    };

    const updateGalleryMediaItemField = <T extends keyof Pick<GalleryMediaItemData, 'frame' | 'is_banner'>>(
        galleryId: string | number,
        mediaItemId: string | number,
        field: T,
        value: GalleryMediaItemData[T],
    ) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.id === galleryId);

        if (foundGalleryIndex === -1) return;

        const foundGallery = data.galleries[foundGalleryIndex];

        setData(
            'galleries',
            data.galleries.with(foundGalleryIndex, {
                ...foundGallery,
                media_items: foundGallery.media_items.map((mediaItem) =>
                    mediaItem.id === mediaItemId ? { ...mediaItem, [field]: value } : mediaItem,
                ),
            }),
        );
    };

    const handleDeleteGalleryMediaItem = (galleryId: string | number, mediaItemId: string | number) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.id === galleryId);

        if (foundGalleryIndex === -1) return;

        const foundGallery = data.galleries[foundGalleryIndex];

        setData(
            'galleries',
            data.galleries.with(foundGalleryIndex, {
                ...foundGallery,
                media_items: foundGallery.media_items.filter((mediaItem) => mediaItem.id !== mediaItemId),
            }),
        );
    };

    const handleChangeGalleryCaption = (galleryId: string | number, caption: string) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.id === galleryId);

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

        const url = !project ? route('projects.store') : route('projects.update', project);

        post(url, {
            onStart: () => clearErrors(),
            onSuccess: ({ props: { message } }) => toast.success(message),
            onError: (error) => toast.error(error.message),
        });
    };

    const renderMediaItemCard = (galleryId: string | number, mediaItem: GalleryMediaItemData) => {
        const isVideo = selectedCategory?.media_type === MediaType.Video;
        const fileUrlError = errors[`galleries.${galleryId}.media_items.${mediaItem.id}.file_url`];
        const frameError = errors[`galleries.${galleryId}.media_items.${mediaItem.id}.frame`];
        const isBannerError = errors[`galleries.${galleryId}.media_items.${mediaItem.id}.is_banner`];

        return (
            <Grid key={mediaItem.id} size={{ xs: 12, sm: 12 / maxMediaItemsCountPerGallery }}>
                <Card variant="outlined" component={Stack} height={1}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Box flex={1}>
                            {isVideo ? (
                                <Box
                                    component="video"
                                    controls
                                    width={1}
                                    height="auto"
                                    sx={{ aspectRatio: mediaItem.frame }}
                                >
                                    <source src={mediaItem.file_url} />
                                </Box>
                            ) : (
                                <Image
                                    src={mediaItem.file_url}
                                    containerSx={{ aspectRatio: mediaItem.frame }}
                                    imageSx={{ width: 1, height: 1 }}
                                />
                            )}
                            {!!fileUrlError && <FormHelperText error>{fileUrlError}</FormHelperText>}
                        </Box>
                        <Stack width={1} gap={4}>
                            <FormField
                                control={
                                    <Fragment>
                                        <Select
                                            value={mediaItem.frame}
                                            onChange={(e) =>
                                                updateGalleryMediaItemField(
                                                    galleryId,
                                                    mediaItem.id,
                                                    'frame',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={processing}
                                        >
                                            {mediaFrameOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {!!frameError && <FormHelperText error>{frameError}</FormHelperText>}
                                    </Fragment>
                                }
                                label={t('frame')}
                                required
                                direction="column"
                            />
                        </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Box>
                            <FormControl>
                                <FormControlLabel
                                    sx={{ m: 0 }}
                                    control={
                                        <Checkbox
                                            edge="start"
                                            size="small"
                                            checked={mediaItem.is_banner}
                                            onChange={(_, checked) =>
                                                updateGalleryMediaItemField(
                                                    galleryId,
                                                    mediaItem.id,
                                                    'is_banner',
                                                    checked,
                                                )
                                            }
                                            disabled={processing}
                                        />
                                    }
                                    label={t('banner')}
                                    slotProps={{ typography: { variant: 'body2' } }}
                                />
                                {!!isBannerError && <FormHelperText error>{isBannerError}</FormHelperText>}
                            </FormControl>
                        </Box>
                        <Button
                            style={{ marginLeft: 0 }}
                            color="error"
                            onClick={() => handleDeleteGalleryMediaItem(galleryId, mediaItem.id)}
                            disabled={processing}
                        >
                            {t('delete')}
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    };

    return (
        <Card component="form" onSubmit={handleSubmit} sx={{ overflow: 'visible', position: 'relative' }}>
            <CardHeader title={t('basic_information')} slotProps={{ title: { variant: 'h3' } }} />
            <CardContent>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormField
                            control={
                                <Fragment>
                                    <Autocomplete
                                        options={categoryOptions}
                                        value={selectedCategory ?? null}
                                        onChange={(_, selected) => setData('category_id', selected?.value ?? null)}
                                        disabled={processing}
                                        disableClearable={!!data.galleries.length}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors.category_id}
                                                helperText={errors.category_id}
                                            />
                                        )}
                                        getOptionDisabled={(option) =>
                                            !!data.galleries.length &&
                                            option.media_type !== selectedCategory?.media_type
                                        }
                                    />
                                    {!!data.galleries.length && (
                                        <FormHelperText>
                                            {t('messages.only_change_category_within_classification')}
                                        </FormHelperText>
                                    )}
                                </Fragment>
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
                                    accept={Object.fromEntries(thumbnailMineTypes.map((mineType) => [mineType, []]))}
                                    onUpload={handleUploadThumbnail}
                                    disabled={
                                        processing ||
                                        uploadThumbnailPercentage !== undefined ||
                                        uploadMediaItemPercentage.value !== undefined
                                    }
                                    onError={(message) => setError('thumbnail_file', message)}
                                    hasError={!!errors.thumbnail_file}
                                    progress={uploadThumbnailPercentage}
                                />
                            }
                            label={t('file')}
                            required
                            direction="column"
                        />
                        {!!errors[`thumbnail_file`] && (
                            <FormHelperText error>{errors[`thumbnail_file`]}</FormHelperText>
                        )}
                    </Box>
                    {!!data.thumbnail_file_url && (
                        <Stack width={{ xs: 1, sm: '50vw', lg: '25vw' }} gap={4} alignSelf="center">
                            <Card variant="outlined" component={Stack} height={1}>
                                <CardContent>
                                    <Image
                                        src={data.thumbnail_file_url}
                                        containerSx={{ aspectRatio: '4/5' }}
                                        imageSx={{ width: 1, height: 1 }}
                                    />
                                    {!!errors.thumbnail_file_url && (
                                        <FormHelperText error>{errors.thumbnail_file_url}</FormHelperText>
                                    )}
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'end' }}>
                                    <Button
                                        color="error"
                                        onClick={() => setData('thumbnail_file_url', '')}
                                        disabled={processing}
                                    >
                                        {t('delete')}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Stack>
                    )}
                </Stack>
            </CardContent>
            <Divider sx={{ my: 4 }} />
            <CardHeader title={t('galleries')} slotProps={{ title: { variant: 'h3' } }} />
            <CardContent>
                {data.category_id ? (
                    <Stack gap={4}>
                        {data.galleries.map((gallery, index) => (
                            <Card key={gallery.id} variant="outlined">
                                <CardHeader
                                    disableTypography
                                    title={
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            gap={4}
                                        >
                                            <Typography variant="h4" fontWeight={600}>{`#${index + 1}`}</Typography>
                                            <Button
                                                color="error"
                                                onClick={() => handleDeleteGallery(gallery.id)}
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
                                                        maxFileSize={mediaSetting?.maxFileSize}
                                                        accept={Object.fromEntries(
                                                            mediaSetting.mineTypes.map((mineType: string[]) => [
                                                                mineType,
                                                                [],
                                                            ]),
                                                        )}
                                                        maxFiles={maxMediaItemsCountPerGallery}
                                                        onUpload={(selected) =>
                                                            handleUploadGalleryMediaItem(gallery.id, selected)
                                                        }
                                                        disabled={
                                                            processing ||
                                                            uploadThumbnailPercentage !== undefined ||
                                                            uploadMediaItemPercentage.value !== undefined
                                                        }
                                                        onError={(message) =>
                                                            setError(`galleries.${gallery.id}.media_items`, message)
                                                        }
                                                        hasError={!!errors[`galleries.${gallery.id}.media_items`]}
                                                        {...(uploadMediaItemPercentage?.galleryId === gallery.id && {
                                                            progress: uploadMediaItemPercentage.value,
                                                        })}
                                                    />
                                                }
                                                label={t('file')}
                                                required
                                                direction="column"
                                            />
                                            {!!errors[`galleries.${gallery.id}.media_items`] && (
                                                <FormHelperText error>
                                                    {errors[`galleries.${gallery.id}.media_items`]}
                                                </FormHelperText>
                                            )}
                                        </Box>
                                        {!!gallery.media_items.length && (
                                            <Grid container spacing={2}>
                                                {gallery.media_items.map((mediaItem) =>
                                                    renderMediaItemCard(gallery.id, mediaItem),
                                                )}
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
                                                        handleChangeGalleryCaption(gallery.id, e.target.value)
                                                    }
                                                    disabled={processing}
                                                    error={!!errors[`galleries.${gallery.id}.caption`]}
                                                    helperText={errors[`galleries.${gallery.id}.caption`]}
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
                ) : (
                    <Alert severity="info">{t('messages.must_select_category_to_add_gallery')}</Alert>
                )}
            </CardContent>
            <CardActions
                sx={{
                    justifyContent: 'space-between',
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: 'background.paper',
                    borderTop: 1,
                    borderColor: 'divider',
                    borderBottomLeftRadius: 'inherit',
                    borderBottomRightRadius: 'inherit',
                }}
            >
                <Button variant="outlined" LinkComponent={Link} href={route('projects.index')} disabled={processing}>
                    {t('cancel')}
                </Button>
                <Stack direction="row" alignItems="center" gap={2}>
                    {!!data.category_id && (
                        <ProjectViewModal
                            renderTrigger={({ openModal }) => (
                                <Button variant="outlined" color="secondary" onClick={openModal} disabled={processing}>
                                    {t('preview')}
                                </Button>
                            )}
                            projectInfo={{
                                title_en: data.title_en,
                                title_vi: data.title_vi,
                                description_en: data.description_en,
                                description_vi: data.description_vi,
                                summary_en: data.summary_en,
                                summary_vi: data.summary_vi,
                                galleries: data.galleries.map((gallery) => ({
                                    caption: gallery.caption,
                                    media_items: gallery.media_items.map((mediaItem) => ({
                                        file_url: mediaItem.file_url,
                                        frame: mediaItem.frame,
                                    })),
                                })),
                                mediaType: categoryOptions.find((category) => category.value === data.category_id)!
                                    .media_type,
                            }}
                            locale={locale}
                        />
                    )}
                    <Button type="submit" loading={processing}>
                        {t('save')}
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
};

export default ProjectForm;
