import TiptapEditor from '@/@core/components/TiptapEditor';
import FormField from '@/Components/FormField';
import GoogleDriveImage from '@/Components/GoogleDriveImage';
import MediaType, { MediaTypeValue } from '@/enums/media-type';
import { Option } from '@/types';
import { Project } from '@/types/project';
import { Link, useForm, usePage } from '@inertiajs/react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent, Fragment, useEffect, useMemo, useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import MediaItemCard from './MediaItemCard';
import ProjectViewModal from './ProjectViewModal';

type Props = {
    webVisibilityOptions: Option[];
    categoryOptions: (Option & { media_type: MediaTypeValue })[];
    mediaFrameOptions: Option<string>[];
    maxMediaItemsCountPerGallery: number;
    project?: Project;
};

type ProjectFormErrorKeys =
    | `thumbnail.${string}`
    | `galleries.${string | number}`
    | `galleries.${string | number}.${string}`
    | `galleries.${string | number}.${string}.${string | number}`
    | `galleries.${string | number}.${string}.${string | number}.${string}`;

type ProjectThumbnailData = {
    file_id: string;
    file_name: string;
    file_mime_type: string;
};

type GalleryMediaItemData = {
    id: string | number;
    file_id: string;
    file_name: string;
    file_mime_type: string;
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
    thumbnail: ProjectThumbnailData | undefined;
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

    const { data, setData, errors, setError, clearErrors, post, put, processing } = useForm<ProjectFormData>({
        category_id: project?.category_id ?? null,
        title_en: project?.title_en ?? '',
        title_vi: project?.title_vi ?? '',
        description_en: project?.description_en ?? '',
        description_vi: project?.description_vi ?? '',
        summary_en: project?.summary_en ?? '',
        summary_vi: project?.summary_vi ?? '',
        is_highlight: project?.is_highlight ?? false,
        web_visibility: (project?.web_visibility ?? webVisibilityOptions[0].value).toString(),
        thumbnail: project
            ? {
                  file_id: project.thumbnail_file_id,
                  file_name: project.thumbnail_file_name,
                  file_mime_type: project.thumbnail_file_mime_type,
              }
            : undefined,
        galleries: project
            ? project.galleries.map<GalleryData>((gallery) => ({
                  id: gallery.id,
                  caption: gallery.caption ?? '',
                  media_items: gallery.media_items.map((mediaItem) => ({
                      id: mediaItem.id,
                      file_id: mediaItem.file_id,
                      file_name: mediaItem.file_name,
                      file_mime_type: mediaItem.file_mime_type,
                      frame: mediaItem.frame,
                      is_banner: mediaItem.is_banner,
                  })),
              }))
            : [],
    });

    const thumbnailErrorMessage =
        errors.thumbnail ||
        errors['thumbnail.file_id'] ||
        errors['thumbnail.file_name'] ||
        errors['thumbnail.file_mime_type'];
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

    const [openPicker, authResponse] = useDrivePicker();

    const [googleDriveAccessToken, setGoogleDriveAccessToken] = useState('');

    useEffect(() => {
        if (authResponse) {
            setGoogleDriveAccessToken(authResponse.access_token);
        }
    }, [authResponse]);

    const handleUploadThumbnail = () => {
        openPicker({
            clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
            developerKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
            viewId: 'DOCS_IMAGES_AND_VIDEOS',
            token: googleDriveAccessToken,
            showUploadView: true,
            showUploadFolders: false,
            supportDrives: false,
            multiselect: false,
            disableDefaultView: false,
            setParentFolder: import.meta.env.VITE_APP_GOOGLE_DRIVE_FOLDER_ID,
            callbackFunction: (data) => {
                if (data.action === 'picked') {
                    clearErrors('thumbnail');

                    const file = data.docs[0];

                    if (!thumbnailMineTypes.includes(file.mimeType)) {
                        const accept = Object.fromEntries(thumbnailMineTypes.map((mineType) => [mineType, []]));

                        setError(
                            'thumbnail',
                            t('messages.invalid_mine_types', { mine_types: Object.keys(accept).join(', ') }),
                        );

                        return;
                    }

                    setData('thumbnail', { file_id: file.id, file_name: file.name, file_mime_type: file.mimeType });
                }
            },
        });
    };

    const handleDeleteThumbnail = () => {
        setData('thumbnail', undefined);
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

    const handleUploadGalleryMediaItems = (galleryId: string | number) => {
        const foundGalleryIndex = data.galleries.findIndex((gallery) => gallery.id === galleryId);

        if (foundGalleryIndex === -1) return;

        const foundGallery = data.galleries[foundGalleryIndex];

        openPicker({
            clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
            developerKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
            viewId: 'DOCS_IMAGES_AND_VIDEOS',
            token: googleDriveAccessToken,
            showUploadView: true,
            showUploadFolders: false,
            supportDrives: false,
            multiselect: true,
            disableDefaultView: false,
            setParentFolder: import.meta.env.VITE_APP_GOOGLE_DRIVE_FOLDER_ID,
            callbackFunction: ({ action, docs }) => {
                if (action === 'picked') {
                    clearErrors(`galleries.${galleryId}.media_items`);

                    const totalMediaItemsCount = foundGallery.media_items.length + docs.length;

                    if (totalMediaItemsCount > maxMediaItemsCountPerGallery) {
                        setError(
                            `galleries.${foundGallery.id}.media_items`,
                            t('messages.too_many_files', {
                                max: maxMediaItemsCountPerGallery,
                                count: maxMediaItemsCountPerGallery,
                            }),
                        );

                        return;
                    }

                    const isValidMineType = docs.every((doc) => mediaSetting.mineTypes.includes(doc.mimeType));

                    if (!isValidMineType) {
                        const accept = Object.fromEntries(
                            mediaSetting.mineTypes.map((mineType: string) => [mineType, []]),
                        );

                        setError(
                            `galleries.${foundGallery.id}.media_items`,
                            t('messages.invalid_mine_types', { mine_types: Object.keys(accept).join(', ') }),
                        );

                        return;
                    }

                    const mediaItems = [
                        ...foundGallery.media_items,
                        ...docs.map<GalleryMediaItemData>((doc) => ({
                            id: uuidv4(),
                            file_id: doc.id,
                            file_mime_type: doc.mimeType,
                            file_name: doc.name,
                            frame: mediaFrameOptions[0].value,
                            is_banner: false,
                        })),
                    ];

                    setData(
                        'galleries',
                        data.galleries.with(foundGalleryIndex, { ...foundGallery, media_items: mediaItems }),
                    );
                }
            },
        });
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
        const method = !project ? post : put;

        method(url, {
            onStart: () => clearErrors(),
            onSuccess: ({ props: { message } }) => toast.success(message),
            onError: (error) => toast.error(error.message),
        });
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
                                        value={
                                            categoryOptions.find((option) => option.value === data.category_id) ?? null
                                        }
                                        onChange={(_, selected) => setData('category_id', selected?.value ?? null)}
                                        disabled={processing || !!data.galleries.length}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                error={!!errors.category_id}
                                                helperText={errors.category_id}
                                            />
                                        )}
                                    />
                                    {!!data.galleries.length && (
                                        <FormHelperText>
                                            {t('messages.cannot_change_category_due_to_gallery')}
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
            <CardHeader
                title={t('thumbnail')}
                action={
                    <Stack direction="row" gap={4}>
                        {!!data.thumbnail && (
                            <Button color="error" onClick={handleDeleteThumbnail} disabled={processing}>
                                {t('delete')}
                            </Button>
                        )}
                        <Button
                            startIcon={<CloudUploadOutlinedIcon />}
                            onClick={handleUploadThumbnail}
                            disabled={processing}
                        >
                            {t('upload')}
                        </Button>
                    </Stack>
                }
                slotProps={{ title: { variant: 'h3' } }}
                sx={{ flexWrap: 'wrap', gap: 4 }}
            />
            <CardContent>
                {data.thumbnail ? (
                    <GoogleDriveImage
                        fileName={data.thumbnail.file_name}
                        containerSx={{ width: { xs: '70vw', sm: '50vw', lg: '30vw' }, mx: 'auto', aspectRatio: '4/5' }}
                        imageSx={{ aspectRatio: '4/5' }}
                    />
                ) : (
                    <Alert severity="error">{t('no_files_uploaded')}</Alert>
                )}
                {!!thumbnailErrorMessage && <FormHelperText error>{thumbnailErrorMessage}</FormHelperText>}
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
                                            <Stack direction="row" gap={4}>
                                                <Button
                                                    color="error"
                                                    onClick={() => handleDeleteGallery(gallery.id)}
                                                    disabled={processing}
                                                >
                                                    {t('delete')}
                                                </Button>
                                                <Button
                                                    startIcon={<CloudUploadOutlinedIcon />}
                                                    onClick={() => handleUploadGalleryMediaItems(gallery.id)}
                                                    disabled={processing}
                                                >
                                                    {t('upload')}
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    }
                                />
                                <CardContent>
                                    {gallery.media_items.length ? (
                                        <Stack gap={4}>
                                            <Grid container spacing={2}>
                                                {gallery.media_items.map((mediaItem) => (
                                                    <Grid key={mediaItem.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                                        <MediaItemCard
                                                            fileName={mediaItem.file_name}
                                                            onDelete={() =>
                                                                handleDeleteGalleryMediaItem(gallery.id, mediaItem.id)
                                                            }
                                                            frame={mediaItem.frame}
                                                            onChangeFrame={(frame) =>
                                                                updateGalleryMediaItemField(
                                                                    gallery.id,
                                                                    mediaItem.id,
                                                                    'frame',
                                                                    frame,
                                                                )
                                                            }
                                                            frameFieldError={
                                                                errors[
                                                                    `galleries.${gallery.id}.media_items.${mediaItem.id}.frame`
                                                                ]
                                                            }
                                                            isBanner={mediaItem.is_banner}
                                                            onChangeIsBanner={(isBanner) =>
                                                                updateGalleryMediaItemField(
                                                                    gallery.id,
                                                                    mediaItem.id,
                                                                    'is_banner',
                                                                    isBanner,
                                                                )
                                                            }
                                                            isBannerFieldError={
                                                                errors[
                                                                    `galleries.${gallery.id}.media_items.${mediaItem.id}.is_banner`
                                                                ]
                                                            }
                                                            disabled={processing}
                                                            isVideo={
                                                                categoryOptions.find(
                                                                    (category) => category.value === data.category_id,
                                                                )?.media_type === MediaType.Video
                                                            }
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Stack>
                                    ) : (
                                        <Alert severity="error">{t('no_files_uploaded')}</Alert>
                                    )}
                                    {!!errors[`galleries.${gallery.id}.media_items`] && (
                                        <FormHelperText error>
                                            {errors[`galleries.${gallery.id}.media_items`]}
                                        </FormHelperText>
                                    )}
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
                                        id: mediaItem.id as number,
                                        file_name: mediaItem.file_name,
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
