import ImageDropzone from '@/@core/components/ImageDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import BackListButton from '@/Components/BackListButton';
import { MaxFileSize } from '@/enums/maxFileSize';
import { Option } from '@/types';
import { Album } from '@/types/album';
import { useForm } from '@inertiajs/react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ChangeEvent, FormEvent, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AlbumDeleteAction from './AlbumDeleteAction';
import AlbumDisableAction from './AlbumDisableAction';
import AlbumRestoreAction from './AlbumRestoreAction';

type Props = {
    album?: Album;
    aspectRatioOptions: Option<string>[];
};

export type AlbumFormPayload = {
    title_en: string;
    title_vi: string;
    name_en: string;
    name_vi: string;
    description_en: string;
    description_vi: string;
    summary_en: string;
    summary_vi: string;
    thumbnail_file?: File;
    thumbnail_frame: string;
    is_highlight: boolean;
    is_thumbnail_deleted?: boolean;
};

const AlbumForm = ({ album, aspectRatioOptions }: Props) => {
    const { t } = useTranslation();

    const { data, setData, errors, setError, clearErrors, post, processing, reset, setDefaults, wasSuccessful } =
        useForm<AlbumFormPayload>({
            title_en: album?.title_en ?? '',
            title_vi: album?.title_vi ?? '',
            name_en: album?.name_en ?? '',
            name_vi: album?.name_vi ?? '',
            description_en: album?.description_en ?? '',
            description_vi: album?.description_vi ?? '',
            summary_en: album?.summary_en ?? '',
            summary_vi: album?.summary_vi ?? '',
            thumbnail_file: undefined,
            thumbnail_frame: album?.thumbnail.aspect_ratio ?? '',
            is_highlight: album?.is_highlight ?? false,
            ...(!!album && { is_thumbnail_deleted: false }),
        });

    const isDisabledForm = processing || !!album?.deleted_at;

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof AlbumFormPayload;
        const value = e.target.value;

        setData(name, value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const url = album ? route('albums.update', album) : route('albums.store');

        post(url, {
            onSuccess: ({ props: { message } }) => {
                toast.success(message);
                setDefaults();
                reset('thumbnail_file');
            },
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Card component="form" onSubmit={handleSubmit}>
            <CardHeader
                disableTypography
                title={
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4} flexWrap="wrap">
                        <Box>
                            {!!album &&
                                (album.deleted_at ? (
                                    <Alert severity="warning">
                                        <Typography variant="h6">{t('data_disabled_alert')}</Typography>
                                    </Alert>
                                ) : (
                                    <Button
                                        component="a"
                                        href="#media"
                                        color="info"
                                        startIcon={<VisibilityOutlinedIcon />}
                                    >
                                        {t('view_media')}
                                    </Button>
                                ))}
                        </Box>
                        <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                            <BackListButton href={route('albums.index')} disabled={processing} />
                            {!!album && (
                                <Fragment>
                                    {album.deleted_at ? (
                                        <AlbumRestoreAction album={album} disabled={processing} />
                                    ) : (
                                        <AlbumDisableAction album={album} disabled={processing} />
                                    )}
                                    <AlbumDeleteAction album={album} disabled={processing} />
                                </Fragment>
                            )}
                        </Stack>
                    </Stack>
                }
            />
            <Divider sx={{ mb: 4 }} />
            <CardContent>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <TextField
                            label={t('title_en')}
                            slotProps={{ inputLabel: { required: true } }}
                            name="title_en"
                            value={data.title_en}
                            onChange={handleChangeInput}
                            disabled={isDisabledForm}
                            error={!!errors.title_en}
                            helperText={errors.title_en}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <TextField
                            label={t('title_vi')}
                            slotProps={{ inputLabel: { required: true } }}
                            name="title_vi"
                            value={data.title_vi}
                            onChange={handleChangeInput}
                            disabled={isDisabledForm}
                            error={!!errors.title_vi}
                            helperText={errors.title_vi}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <TextField
                            label={t('name_en')}
                            slotProps={{ inputLabel: { required: true } }}
                            name="name_en"
                            value={data.name_en}
                            onChange={handleChangeInput}
                            disabled={isDisabledForm}
                            error={!!errors.name_en}
                            helperText={errors.name_en}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <TextField
                            label={t('name_vi')}
                            slotProps={{ inputLabel: { required: true } }}
                            name="name_vi"
                            value={data.name_vi}
                            onChange={handleChangeInput}
                            disabled={isDisabledForm}
                            error={!!errors.name_vi}
                            helperText={errors.name_vi}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormControl required>
                            <FormLabel>{t('description_en')}</FormLabel>
                            <TiptapEditor
                                characterLimit={5000}
                                value={data.description_en}
                                onChange={(content) => setData('description_en', content)}
                                disabled={isDisabledForm}
                                error={!!errors.description_en}
                                helperText={errors.description_en}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormControl required>
                            <FormLabel>{t('description_vi')}</FormLabel>
                            <TiptapEditor
                                characterLimit={5000}
                                value={data.description_vi}
                                onChange={(content) => setData('description_vi', content)}
                                disabled={isDisabledForm}
                                error={!!errors.description_vi}
                                helperText={errors.description_vi}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormControl required>
                            <FormLabel>{t('summary_en')}</FormLabel>
                            <TiptapEditor
                                characterLimit={5000}
                                value={data.summary_en}
                                onChange={(content) => setData('summary_en', content)}
                                disabled={isDisabledForm}
                                error={!!errors.summary_en}
                                helperText={errors.summary_en}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormControl required>
                            <FormLabel>{t('summary_vi')}</FormLabel>
                            <TiptapEditor
                                characterLimit={5000}
                                value={data.summary_vi}
                                onChange={(content) => setData('summary_vi', content)}
                                disabled={isDisabledForm}
                                error={!!errors.summary_vi}
                                helperText={errors.summary_vi}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormControl required>
                            <FormLabel>{t('thumbnail')}</FormLabel>
                            <ImageDropzone
                                maxSize={MaxFileSize.Image}
                                onChange={(selectedImage) => setData('thumbnail_file', selectedImage?.file)}
                                onDeleteImage={() =>
                                    setData((prev) => ({
                                        ...prev,
                                        thumbnail_file: undefined,
                                        is_thumbnail_deleted: true,
                                    }))
                                }
                                onError={(errorMessage) => setError('thumbnail_file', errorMessage)}
                                error={!!errors.thumbnail_file}
                                helperText={errors.thumbnail_file}
                                disabled={isDisabledForm}
                                shouldReset={wasSuccessful}
                                {...(!!album && {
                                    initImage: {
                                        url: album.thumbnail.url,
                                        file_name: album.thumbnail.file_name,
                                        file_size: album.thumbnail.file_size,
                                    },
                                })}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" alignItems="center" gap={4}>
                            <FormLabel sx={{ mb: 0 }}>{t('frame')}</FormLabel>
                            <Box>
                                <RadioGroup
                                    value={data.thumbnail_frame}
                                    onChange={(e) => setData('thumbnail_frame', e.target.value)}
                                    sx={{ flexDirection: 'row' }}
                                >
                                    {aspectRatioOptions.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.value}
                                            control={<Radio />}
                                            label={option.label}
                                        />
                                    ))}
                                </RadioGroup>
                                {!!errors.thumbnail_frame && (
                                    <FormHelperText error>{errors.thumbnail_frame}</FormHelperText>
                                )}
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" alignItems="center" gap={4}>
                            <FormLabel sx={{ mb: 0 }}>{t('highlight')}</FormLabel>
                            <Box>
                                <Switch
                                    disabled={isDisabledForm}
                                    checked={data.is_highlight}
                                    onChange={(_, isChecked) => setData('is_highlight', isChecked)}
                                />
                                {!!errors.is_highlight && <FormHelperText error>{errors.is_highlight}</FormHelperText>}
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
            {!album?.deleted_at && (
                <Fragment>
                    <Divider sx={{ mt: 4 }} />
                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button type="submit" loading={processing}>
                            {!album ? t('add') : t('save')}
                        </Button>
                    </CardActions>
                </Fragment>
            )}
        </Card>
    );
};

export default AlbumForm;
