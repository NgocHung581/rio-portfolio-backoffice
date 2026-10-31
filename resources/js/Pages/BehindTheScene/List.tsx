import FileDropzone from '@/@core/components/FileDropzone';
import ConfirmationModal, { ConfirmationModalProps } from '@/Components/ConfirmationModal';
import { Option, PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import DialogContentText from '@mui/material/DialogContentText';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import FrameAutocomplete from '../Project/components/FrameAutocomplete';

type BehindTheSceneItem = {
    id: number;
    file_url: string;
    frame: string;
};

type PendingItem = {
    id: string;
    file_url: string;
    frame: string;
    isVideo: boolean;
};

type BehindTheSceneListPageProps = PageProps<{
    mediaItems: BehindTheSceneItem[];
    mediaFrameOptions: Option<string>[];
}>;

const VIDEO_FILE_REGEX = /\.(mp4|mov|webm|m4v|ogg)$/i;

type TileProps = {
    fileUrl: string;
    isVideo: boolean;
    frame: string;
    frameOptions: Option<string>[];
    disabled: boolean;
    error?: string;
    onChangeFrame: (frame: string) => void;
    /** Rendered before the frame select, e.g. a checkbox. */
    leading?: React.ReactNode;
    /** Rendered on the top right corner of the media, e.g. a delete button. */
    topRight?: React.ReactNode;
};

/**
 * One media item: a preview in its own frame, and a select to choose the frame.
 */
const Tile = ({
    fileUrl,
    isVideo,
    frame,
    frameOptions,
    disabled,
    error,
    onChangeFrame,
    leading,
    topRight,
}: TileProps) => {
    return (
        <Stack
            gap={2}
            p={2}
            bgcolor="background.paper"
            border={1}
            borderColor={error ? 'error.main' : 'divider'}
            borderRadius={1}
        >
            <Box
                position="relative"
                overflow="hidden"
                borderRadius={0.75}
                bgcolor="action.selected"
                sx={{ aspectRatio: frame }}
            >
                {isVideo ? (
                    <Box
                        component="video"
                        controls
                        muted
                        src={fileUrl}
                        width={1}
                        height={1}
                        sx={{ objectFit: 'cover', display: 'block' }}
                    />
                ) : (
                    <Box
                        component="img"
                        src={fileUrl}
                        alt=""
                        width={1}
                        height={1}
                        sx={{ objectFit: 'cover', display: 'block' }}
                    />
                )}
                {topRight && (
                    <Box position="absolute" top={8} right={8}>
                        {topRight}
                    </Box>
                )}
            </Box>
            <Stack direction="row" alignItems="center" gap={1}>
                {leading}
                <FrameAutocomplete
                    value={frame}
                    options={frameOptions}
                    onChange={onChangeFrame}
                    disabled={disabled}
                    error={!!error}
                    sx={{ flex: 1, minWidth: 0 }}
                />
            </Stack>
            {error && (
                <FormHelperText error sx={{ m: 0 }}>
                    {error}
                </FormHelperText>
            )}
        </Stack>
    );
};

const GRID_SX = {
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' },
    gap: 3,
    alignItems: 'start',
};

const BehindTheSceneListPage = () => {
    const { t } = useTranslation();
    const { mediaItems, mediaFrameOptions, errors } = usePage<BehindTheSceneListPageProps>().props;

    const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [uploadPercentage, setUploadPercentage] = useState<number | undefined>(undefined);
    const [uploadError, setUploadError] = useState<string>();
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const imageMineTypes: string[] = import.meta.env.VITE_APP_IMAGE_MINE_TYPES?.split(',') ?? [];
    const videoMineTypes: string[] = import.meta.env.VITE_APP_VIDEO_MINE_TYPES?.split(',') ?? [];
    // The server applies the exact limit of each type; the dropzone only needs to let both types through.
    const maxFileSize = Math.max(
        Number(import.meta.env.VITE_APP_IMAGE_SIZE_LIMIT) || 0,
        Number(import.meta.env.VITE_APP_VIDEO_SIZE_LIMIT) || 0,
    );
    const isUploading = uploadPercentage !== undefined;
    const isBusy = isUploading || isSaving || isDeleting;
    const itemErrors = errors as Record<string, string | undefined>;

    const uploadFile = (file: File) =>
        new Promise<string | null>((resolve) => {
            router.post(
                route('files.upload'),
                { file },
                {
                    showProgress: false,
                    preserveScroll: true,
                    preserveUrl: true,
                    preserveState: true,
                    onProgress: (e) => setUploadPercentage(e?.percentage),
                    onSuccess: (page) => resolve(page.props.flash['fileUrl'] as string),
                    onError: (error) => {
                        toast.error(error.message);
                        resolve(null);
                    },
                },
            );
        });

    // One file per request: videos are large, and several of them could exceed the request size limit of PHP.
    const handleUpload = async (file: File) => {
        setUploadError(undefined);
        setUploadPercentage(0);

        const fileUrl = await uploadFile(file);

        if (fileUrl) {
            setPendingItems((items) => [
                ...items,
                {
                    id: uuidv4(),
                    file_url: fileUrl,
                    frame: mediaFrameOptions[0].value,
                    isVideo: file.type.startsWith('video/'),
                },
            ]);
        }

        setUploadPercentage(undefined);
    };

    const handleChangePendingFrame = (id: string, frame: string) => {
        setPendingItems((items) => items.map((item) => (item.id === id ? { ...item, frame } : item)));
    };

    const handleSave = () => {
        router.post(
            route('behindTheScenes.store'),
            { items: pendingItems.map(({ file_url, frame }) => ({ file_url, frame })) },
            {
                preserveScroll: true,
                onStart: () => setIsSaving(true),
                onFinish: () => setIsSaving(false),
                onSuccess: ({ props: { message } }) => {
                    toast.success(message);
                    setPendingItems([]);
                },
                onError: (error) => toast.error(error.message ?? t('messages.internal_server_error')),
            },
        );
    };

    const handleChangeFrame = (id: number, frame: string) => {
        router.post(
            route('behindTheScenes.update', id),
            { frame },
            {
                preserveScroll: true,
                onSuccess: ({ props: { message } }) => toast.success(message),
                onError: (error) => toast.error(error.message ?? error.frame),
            },
        );
    };

    const handleToggleSelected = (id: number) => {
        setSelectedIds((ids) => (ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id]));
    };

    const handleDelete: ConfirmationModalProps['onConfirm'] = ({ closeModal }) => {
        router.post(
            route('behindTheScenes.bulkDelete'),
            { ids: selectedIds },
            {
                preserveScroll: true,
                onStart: () => setIsDeleting(true),
                onFinish: () => setIsDeleting(false),
                onSuccess: ({ props: { message } }) => {
                    toast.success(message);
                    closeModal();
                    setSelectedIds([]);
                },
                onError: (error) => toast.error(error.message),
            },
        );
    };

    return (
        <Stack gap={{ xs: 4, sm: 6 }}>
            <Head title={t('behind_the_scenes')} />
            <Stack component="header" gap={2}>
                <Typography variant="h1">{t('behind_the_scenes')}</Typography>
                <Typography color="textSecondary" maxWidth="65ch">
                    {t('behind_the_scenes_description')}
                </Typography>
            </Stack>

            <Card>
                <CardHeader
                    title={t('upload_media')}
                    slotProps={{ title: { variant: 'h4', component: 'h2' } }}
                    action={
                        !!pendingItems.length && (
                            <Stack direction="row" gap={2}>
                                <Button variant="outlined" onClick={() => setPendingItems([])} disabled={isBusy}>
                                    {t('cancel')}
                                </Button>
                                <Button onClick={handleSave} loading={isSaving} disabled={isBusy}>
                                    {t('save')}
                                </Button>
                            </Stack>
                        )
                    }
                />
                <CardContent>
                    <Stack gap={4}>
                        <FileDropzone
                            height={200}
                            maxFileSize={maxFileSize || undefined}
                            accept={Object.fromEntries(
                                [...imageMineTypes, ...videoMineTypes].map((type) => [type, []]),
                            )}
                            onUpload={handleUpload}
                            onError={setUploadError}
                            disabled={isBusy}
                            hasError={!!uploadError}
                            progress={uploadPercentage}
                        />
                        {uploadError && <FormHelperText error>{uploadError}</FormHelperText>}
                        {!!pendingItems.length && (
                            <Box sx={GRID_SX}>
                                {pendingItems.map((item, index) => (
                                    <Tile
                                        key={item.id}
                                        fileUrl={item.file_url}
                                        isVideo={item.isVideo}
                                        frame={item.frame}
                                        frameOptions={mediaFrameOptions}
                                        disabled={isBusy}
                                        error={
                                            itemErrors[`items.${index}.file_url`] ?? itemErrors[`items.${index}.frame`]
                                        }
                                        onChangeFrame={(frame) => handleChangePendingFrame(item.id, frame)}
                                        topRight={
                                            <Tooltip title={t('delete')}>
                                                <IconButton
                                                    size="small"
                                                    aria-label={t('delete')}
                                                    onClick={() =>
                                                        setPendingItems((items) =>
                                                            items.filter(({ id }) => id !== item.id),
                                                        )
                                                    }
                                                    disabled={isBusy}
                                                    sx={{
                                                        bgcolor: 'background.paper',
                                                        boxShadow: 1,
                                                        '&:hover': { bgcolor: 'background.paper', color: 'error.main' },
                                                    }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    />
                                ))}
                            </Box>
                        )}
                        {itemErrors['items'] && <FormHelperText error>{itemErrors['items']}</FormHelperText>}
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    title={t('uploaded_media_count', { count: mediaItems.length })}
                    slotProps={{ title: { variant: 'h4', component: 'h2' } }}
                    action={
                        <ConfirmationModal
                            renderTrigger={({ openModal }) =>
                                !!selectedIds.length && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteOutlineIcon />}
                                        onClick={openModal}
                                        disabled={isBusy}
                                    >
                                        {t('delete_selected_media', { count: selectedIds.length })}
                                    </Button>
                                )
                            }
                            content={<DialogContentText>{t('delete_media_confirmation')}</DialogContentText>}
                            onConfirm={handleDelete}
                            isLoading={isDeleting}
                        />
                    }
                />
                <CardContent>
                    {mediaItems.length ? (
                        <Box sx={GRID_SX}>
                            {mediaItems.map((item) => (
                                <Tile
                                    key={item.id}
                                    fileUrl={item.file_url}
                                    isVideo={VIDEO_FILE_REGEX.test(item.file_url)}
                                    frame={item.frame}
                                    frameOptions={mediaFrameOptions}
                                    disabled={isBusy}
                                    onChangeFrame={(frame) => handleChangeFrame(item.id, frame)}
                                    leading={
                                        <Checkbox
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleToggleSelected(item.id)}
                                            disabled={isBusy}
                                            inputProps={{ 'aria-label': t('select') }}
                                            sx={{ p: 0.5 }}
                                        />
                                    }
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography color="textSecondary">{t('no_media_yet')}</Typography>
                    )}
                </CardContent>
            </Card>
        </Stack>
    );
};

export default BehindTheSceneListPage;
