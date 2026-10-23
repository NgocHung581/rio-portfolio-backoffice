import FileDropzone from '@/@core/components/FileDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import FormActionBar from '@/Components/FormActionBar';
import FormField from '@/Components/FormField';
import Image from '@/Components/Image';
import LanguageTabs, { findLanguageToShow, OtherLanguageErrorAlerts } from '@/Components/LanguageTabs';
import LeavePageConfirmation from '@/Components/LeavePageConfirmation';
import { moveArrayItem } from '@/Components/SortableItem';
import { Language } from '@/enums/language';
import MediaType, { MediaTypeValue } from '@/enums/media-type';
import WebVisibility from '@/enums/web-visibility';
import { Option } from '@/types';
import { Project } from '@/types/project';
import { describeFileRequirements } from '@/utils/file';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FormEvent, Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { GalleryData, GalleryMediaItemData } from '../types';
import GalleryBlock from './GalleryBlock';
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

type TranslatableField = 'title' | 'description' | 'summary';

const TRANSLATABLE_FIELDS = ['title', 'description', 'summary'] as const;

const ProjectForm = ({
    categoryOptions,
    maxMediaItemsCountPerGallery,
    mediaFrameOptions,
    webVisibilityOptions,
    project,
}: Props) => {
    const { t } = useTranslation();
    const { locale } = usePage().props;

    const { data, setData, errors, setError, clearErrors, post, processing, isDirty } = useForm<ProjectFormData>({
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
    const [contentLanguage, setContentLanguage] = useState<Language>(Language.English);
    const [uploadThumbnailPercentage, setUploadThumbnailPercentage] = useState<number | undefined>(undefined);
    const [uploadMediaItemPercentage, setUploadMediaItemPercentage] = useState<{
        galleryId: string | number | undefined;
        value: number | undefined;
    }>({ galleryId: undefined, value: undefined });

    const selectedCategory = categoryOptions.find((option) => option.value === data.category_id);
    const isVideo = selectedCategory?.media_type === MediaType.Video;
    const isUploading = uploadThumbnailPercentage !== undefined || uploadMediaItemPercentage.value !== undefined;
    const errorMessages = errors as Partial<Record<string, string>>;
    const hasErrors = Object.keys(errors).some((key) => key !== 'message');
    const thumbnailMineTypes: string[] = import.meta.env.VITE_APP_IMAGE_MINE_TYPES?.split(',') ?? [];
    const thumbnailMaxFileSize = Number(import.meta.env.VITE_APP_IMAGE_SIZE_LIMIT);
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

    const handleSortGalleries = (fromIndex: number, toIndex: number) => {
        setData('galleries', moveArrayItem(data.galleries, fromIndex, toIndex));
    };

    const handleSortGalleryMediaItems = (galleryId: string | number, fromIndex: number, toIndex: number) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.id === galleryId);

        if (foundGalleryIndex === -1) return;

        const foundGallery = data.galleries[foundGalleryIndex];

        setData(
            'galleries',
            data.galleries.with(foundGalleryIndex, {
                ...foundGallery,
                media_items: moveArrayItem(foundGallery.media_items, fromIndex, toIndex),
            }),
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
            onError: (error) => {
                toast.error(error.message);
                setContentLanguage(findLanguageToShow(error, TRANSLATABLE_FIELDS, contentLanguage));
            },
        });
    };

    const renderTranslatableField = (field: TranslatableField, language: Language) => {
        const key = `${field}_${language}` as `${TranslatableField}_${Language}`;

        if (field === 'title') {
            return (
                <FormField
                    control={
                        <TextField
                            value={data[key]}
                            onChange={(e) => setData(key, e.target.value)}
                            disabled={processing}
                            error={!!errors[key]}
                            helperText={errors[key]}
                        />
                    }
                    label={t('title')}
                    required
                    direction="column"
                />
            );
        }

        return (
            <FormField
                control={
                    <TiptapEditor
                        characterLimit={5000}
                        value={data[key]}
                        onChange={(content) => setData(key, content)}
                        disabled={processing}
                        error={!!errors[key]}
                        helperText={errors[key]}
                    />
                }
                label={t(field)}
                required
                direction="column"
            />
        );
    };

    const thumbnailRequirements = t(
        'file_requirements',
        describeFileRequirements(thumbnailMineTypes, thumbnailMaxFileSize),
    );
    const mediaRequirements = t(
        'file_requirements',
        describeFileRequirements(mediaSetting.mineTypes, mediaSetting.maxFileSize),
    );

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <LeavePageConfirmation when={isDirty && !processing} />
            <Grid container spacing={6}>
                {/* Content: one language at a time, so long rich-text fields stay readable. */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card>
                        <CardHeader
                            title={t('content')}
                            subheader={t('content_description')}
                            slotProps={{
                                title: { variant: 'h4', component: 'h2' },
                                subheader: { variant: 'body2' },
                            }}
                        />
                        <LanguageTabs
                            value={contentLanguage}
                            onChange={setContentLanguage}
                            errors={errorMessages}
                            fields={TRANSLATABLE_FIELDS}
                        />
                        <CardContent>
                            <Stack gap={6} pt={2}>
                                <OtherLanguageErrorAlerts
                                    value={contentLanguage}
                                    onChange={setContentLanguage}
                                    errors={errorMessages}
                                    fields={TRANSLATABLE_FIELDS}
                                />
                                {TRANSLATABLE_FIELDS.map((field) => (
                                    <Fragment key={`${field}_${contentLanguage}`}>
                                        {renderTranslatableField(field, contentLanguage)}
                                    </Fragment>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack gap={6}>
                        {/* Publishing: everything that decides where and how the project shows up. */}
                        <Card>
                            <CardHeader
                                title={t('publishing')}
                                slotProps={{ title: { variant: 'h4', component: 'h2' } }}
                            />
                            <CardContent>
                                <Stack gap={5}>
                                    <FormField
                                        control={
                                            <Fragment>
                                                <Autocomplete
                                                    options={categoryOptions}
                                                    value={selectedCategory ?? null}
                                                    onChange={(_, selected) =>
                                                        setData('category_id', selected?.value ?? null)
                                                    }
                                                    disabled={processing}
                                                    disableClearable={!!data.galleries.length}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder={t('select_category')}
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
                                    <Box>
                                        <FormLabel id="web-visibility-label" required>
                                            {t('web_visibility')}
                                        </FormLabel>
                                        <ToggleButtonGroup
                                            exclusive
                                            fullWidth
                                            size="small"
                                            color="primary"
                                            value={data.web_visibility}
                                            onChange={(_, selected: string | null) =>
                                                selected !== null && setData('web_visibility', selected)
                                            }
                                            disabled={processing}
                                            aria-labelledby="web-visibility-label"
                                            sx={{ mt: 1 }}
                                        >
                                            {webVisibilityOptions.map((option) => (
                                                <ToggleButton
                                                    key={option.value}
                                                    value={option.value.toString()}
                                                    sx={{ gap: 2, textTransform: 'none', fontSize: 14 }}
                                                >
                                                    {option.value === WebVisibility.Public ? (
                                                        <PublicOutlinedIcon fontSize="small" />
                                                    ) : (
                                                        <LockOutlinedIcon fontSize="small" />
                                                    )}
                                                    {option.label}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                        <FormHelperText error={!!errors.web_visibility}>
                                            {errors.web_visibility ??
                                                t(
                                                    Number(data.web_visibility) === WebVisibility.Public
                                                        ? 'public_description'
                                                        : 'private_description',
                                                )}
                                        </FormHelperText>
                                    </Box>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4}>
                                        <Box>
                                            <FormLabel htmlFor="is-highlight" sx={{ display: 'block', mb: 0.5 }}>
                                                {t('highlight')}
                                            </FormLabel>
                                            <Typography variant="body2" color="textSecondary">
                                                {t('highlight_description')}
                                            </Typography>
                                        </Box>
                                        <Switch
                                            id="is-highlight"
                                            checked={data.is_highlight}
                                            onChange={(_, checked) => setData('is_highlight', checked)}
                                            disabled={processing}
                                        />
                                    </Stack>
                                    {!!errors.is_highlight && (
                                        <FormHelperText error sx={{ mt: -3 }}>
                                            {errors.is_highlight}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Thumbnail: previewed in the same 4:5 frame it is shown in on the website. */}
                        <Card>
                            <CardHeader
                                title={
                                    <FormLabel required component="span" sx={{ font: 'inherit', color: 'inherit' }}>
                                        {t('thumbnail')}
                                    </FormLabel>
                                }
                                subheader={t('thumbnail_description')}
                                slotProps={{
                                    title: { variant: 'h4', component: 'h2' },
                                    subheader: { variant: 'body2' },
                                }}
                            />
                            <CardContent>
                                <Box maxWidth={{ xs: 320, lg: 1 }} mx="auto">
                                    {data.thumbnail_file_url ? (
                                        <Box
                                            position="relative"
                                            overflow="hidden"
                                            borderRadius={1}
                                            border={1}
                                            borderColor={errors.thumbnail_file_url ? 'error.main' : 'divider'}
                                        >
                                            <Image
                                                src={data.thumbnail_file_url}
                                                alt={t('thumbnail')}
                                                containerSx={{ aspectRatio: '4/5' }}
                                                imageSx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                                            />
                                            <Tooltip title={t('delete')}>
                                                <IconButton
                                                    size="small"
                                                    aria-label={t('delete')}
                                                    onClick={() => setData('thumbnail_file_url', '')}
                                                    disabled={processing}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        bgcolor: 'background.paper',
                                                        boxShadow: 1,
                                                        '&:hover': { bgcolor: 'background.paper', color: 'error.main' },
                                                    }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    ) : (
                                        <Box sx={{ aspectRatio: '4/5' }}>
                                            <FileDropzone
                                                compact
                                                height="100%"
                                                maxFileSize={thumbnailMaxFileSize}
                                                accept={Object.fromEntries(
                                                    thumbnailMineTypes.map((mineType) => [mineType, []]),
                                                )}
                                                onUpload={handleUploadThumbnail}
                                                disabled={processing || isUploading}
                                                onError={(message) => setError('thumbnail_file', message)}
                                                hasError={!!errors.thumbnail_file}
                                                progress={uploadThumbnailPercentage}
                                            />
                                        </Box>
                                    )}
                                    {errors.thumbnail_file || errors.thumbnail_file_url ? (
                                        <FormHelperText error>
                                            {errors.thumbnail_file ?? errors.thumbnail_file_url}
                                        </FormHelperText>
                                    ) : (
                                        !data.thumbnail_file_url && (
                                            <FormHelperText>{thumbnailRequirements}</FormHelperText>
                                        )
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Galleries: each gallery is one row of media on the project page. */}
                <Grid size={12}>
                    <Card>
                        <CardHeader
                            title={t('galleries')}
                            subheader={t('galleries_description', { max: maxMediaItemsCountPerGallery })}
                            slotProps={{
                                title: { variant: 'h4', component: 'h2' },
                                subheader: { variant: 'body2' },
                            }}
                        />
                        <CardContent>
                            {data.category_id && data.galleries.length ? (
                                <Stack gap={4}>
                                    {data.galleries.map((gallery, index) => (
                                        <GalleryBlock
                                            key={gallery.id}
                                            gallery={gallery}
                                            index={index}
                                            isSortable={data.galleries.length > 1}
                                            isVideo={isVideo}
                                            maxMediaItemsCount={maxMediaItemsCountPerGallery}
                                            frameOptions={mediaFrameOptions}
                                            accept={Object.fromEntries(
                                                mediaSetting.mineTypes.map((mineType: string) => [mineType, []]),
                                            )}
                                            maxFileSize={mediaSetting.maxFileSize}
                                            requirements={mediaRequirements}
                                            disabled={processing}
                                            isUploadDisabled={processing || isUploading}
                                            uploadProgress={
                                                uploadMediaItemPercentage.galleryId === gallery.id
                                                    ? uploadMediaItemPercentage.value
                                                    : undefined
                                            }
                                            getError={(key) => errorMessages[key]}
                                            onSort={handleSortGalleries}
                                            onDelete={() => handleDeleteGallery(gallery.id)}
                                            onUpload={(file) => handleUploadGalleryMediaItem(gallery.id, file)}
                                            onUploadError={(message) =>
                                                setError(`galleries.${gallery.id}.media_items`, message)
                                            }
                                            onSortMediaItems={(fromIndex, toIndex) =>
                                                handleSortGalleryMediaItems(gallery.id, fromIndex, toIndex)
                                            }
                                            onChangeMediaItem={(mediaItemId, field, value) =>
                                                updateGalleryMediaItemField(gallery.id, mediaItemId, field, value)
                                            }
                                            onDeleteMediaItem={(mediaItemId) =>
                                                handleDeleteGalleryMediaItem(gallery.id, mediaItemId)
                                            }
                                            onChangeCaption={(caption) =>
                                                handleChangeGalleryCaption(gallery.id, caption)
                                            }
                                        />
                                    ))}
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        startIcon={<AddOutlinedIcon />}
                                        onClick={handleAddGallery}
                                        disabled={processing}
                                        sx={{ borderStyle: 'dashed', '&:hover': { borderStyle: 'dashed' } }}
                                    >
                                        {t('add_gallery')}
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack
                                    alignItems="center"
                                    textAlign="center"
                                    gap={3}
                                    py={10}
                                    px={4}
                                    bgcolor="action.hover"
                                    borderRadius={1}
                                >
                                    <CollectionsOutlinedIcon fontSize="large" color="action" />
                                    <Typography color="textSecondary" maxWidth={420}>
                                        {data.category_id
                                            ? t('no_galleries_yet')
                                            : t('messages.must_select_category_to_add_gallery')}
                                    </Typography>
                                    {!!data.category_id && (
                                        <Button
                                            startIcon={<AddOutlinedIcon />}
                                            onClick={handleAddGallery}
                                            disabled={processing}
                                        >
                                            {t('add_gallery')}
                                        </Button>
                                    )}
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <FormActionBar
                hasErrors={hasErrors}
                start={
                    <Button variant="text" LinkComponent={Link} href={route('projects.index')} disabled={processing}>
                        {t('cancel')}
                    </Button>
                }
            >
                {!!selectedCategory && (
                    <ProjectViewModal
                        renderTrigger={({ openModal }) => (
                            <Button variant="outlined" onClick={openModal} disabled={processing}>
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
                            mediaType: selectedCategory.media_type,
                        }}
                        locale={locale}
                    />
                )}
                <Button type="submit" loading={processing}>
                    {t('save')}
                </Button>
            </FormActionBar>
        </Box>
    );
};

export default ProjectForm;
