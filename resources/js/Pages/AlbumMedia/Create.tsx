import ImageDropzone from '@/@core/components/ImageDropzone';
import VideoField from '@/@core/components/VideoField';
import { Language } from '@/enums/language';
import { MaxFileSize } from '@/enums/maxFileSize';
import { MediaType } from '@/enums/mediaType';
import { Option, PageProps } from '@/types';
import { Album } from '@/types/album';
import { Head, useForm } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ChangeEvent, FormEvent, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type Props = {
    album: Album;
    mediaTypeOptions: Option[];
    columnSpanOptions: Option[];
    imagesCountLimitPerUpload: number;
    videosCountLimitPerUpload: number;
};

type Media = {
    file: File | undefined;
    column_span: number | null;
    is_displayed_on_banner: boolean;
};

type FormPayload = {
    media_type: number | null;
    media: Record<number, Media>;
    [key: `media.${number}.${string}`]: string;
};

const CreateAlbumMediaPage = ({
    album,
    mediaTypeOptions,
    columnSpanOptions,
    imagesCountLimitPerUpload,
    videosCountLimitPerUpload,
}: PageProps<Props>) => {
    const { t, i18n } = useTranslation();

    const { data, setData, errors, setError, clearErrors, processing, post } = useForm<FormPayload>({
        media_type: null,
        media: {},
    });

    const [mediaCountLimitPerUpload, setMediaCountLimitPerUpload] = useState(0);

    const mediaKeys = Object.keys(data.media).map((key) => Number(key));

    const handleSelectMediaType = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = Number(e.target.value);

        if (value === MediaType.Image) {
            setMediaCountLimitPerUpload(imagesCountLimitPerUpload);
        }

        if (value === MediaType.Video) {
            setMediaCountLimitPerUpload(videosCountLimitPerUpload);
        }

        setData({
            media_type: value,
            media: { [Date.now()]: { file: undefined, column_span: null, is_displayed_on_banner: false } },
        });
    };

    const handleAddMediaInfoBlock = () => {
        if (mediaKeys.length < mediaCountLimitPerUpload) {
            setData('media', {
                ...data.media,
                [Date.now()]: { file: undefined, column_span: null, is_displayed_on_banner: false },
            });
        }
    };

    const handleDeleteMediaInfoBlock = (mediaKey: number) => {
        delete data.media[mediaKey];
        setData('media', data.media);
    };

    const handleUpdateMediaInfo = (mediaKey: number, value: Partial<Media>) => {
        data.media[mediaKey] = { ...data.media[mediaKey], ...value };
        setData('media', data.media);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        post(route('albums.media.store', album), {
            onSuccess: ({ props: { message } }) => toast.success(message),
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Stack spacing={6}>
            <Head title={t('upload_album_media')} />
            <Typography variant="h1">{t('upload_album_media')}</Typography>
            <Card component="form" onSubmit={handleSubmit}>
                <CardHeader
                    title={`${t('album')}: ${i18n.language === Language.Vietnamese ? album.name_vi : album.name_en}`}
                    slotProps={{ content: { sx: { wordBreak: 'break-word' } }, title: { color: 'primary' } }}
                />
                <Divider sx={{ mb: 4 }} />
                <CardContent>
                    <Stack spacing={4}>
                        <Box width={{ xs: 1, sm: 0.5 }}>
                            <TextField
                                label={t('media_type')}
                                select
                                value={data.media_type ?? ''}
                                slotProps={{ inputLabel: { required: true } }}
                                onChange={handleSelectMediaType}
                                error={!!errors.media_type}
                                helperText={errors.media_type}
                                disabled={processing}
                            >
                                {mediaTypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        {mediaKeys.length > 0 &&
                            mediaKeys.map((mediaKey, index) => (
                                <Card key={mediaKey} variant="outlined">
                                    <CardHeader
                                        disableTypography
                                        title={
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                gap={4}
                                            >
                                                <Typography variant="h5">{`#${index + 1}`}</Typography>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteMediaInfoBlock(mediaKey)}
                                                    disabled={processing || mediaKeys.length === 1}
                                                >
                                                    <DeleteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        }
                                    />
                                    <Divider />
                                    <CardContent>
                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label={t('column_width')}
                                                    select
                                                    value={data.media[mediaKey].column_span ?? ''}
                                                    slotProps={{ inputLabel: { required: true } }}
                                                    onChange={(e) =>
                                                        handleUpdateMediaInfo(mediaKey, {
                                                            column_span: Number(e.target.value),
                                                        })
                                                    }
                                                    error={!!errors[`media.${mediaKey}.column_span`]}
                                                    helperText={errors[`media.${mediaKey}.column_span`]}
                                                    disabled={processing}
                                                >
                                                    {columnSpanOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Grid container spacing={4} alignItems="center">
                                                    <Grid size={{ xs: 12, sm: 2 }}>
                                                        <FormLabel>{t('display_on_banner')}</FormLabel>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 10 }}>
                                                        <Switch
                                                            edge="start"
                                                            disabled={processing}
                                                            checked={data.media[mediaKey].is_displayed_on_banner}
                                                            onChange={(_, isChecked) =>
                                                                handleUpdateMediaInfo(mediaKey, {
                                                                    is_displayed_on_banner: isChecked,
                                                                })
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                {data.media_type === MediaType.Image ? (
                                                    <FormControl required>
                                                        <FormLabel>{t('image')}</FormLabel>
                                                        <ImageDropzone
                                                            maxSize={MaxFileSize.Image}
                                                            onChange={(file) =>
                                                                handleUpdateMediaInfo(mediaKey, { file })
                                                            }
                                                            onDeleteImage={() =>
                                                                handleUpdateMediaInfo(mediaKey, { file: undefined })
                                                            }
                                                            onError={(errorMessage) =>
                                                                setError(`media.${mediaKey}.file`, errorMessage)
                                                            }
                                                            error={!!errors[`media.${mediaKey}.file`]}
                                                            helperText={errors[`media.${mediaKey}.file`]}
                                                            disabled={processing}
                                                        />
                                                    </FormControl>
                                                ) : (
                                                    <Grid container spacing={4} alignItems="center">
                                                        <Grid size={{ xs: 12, sm: 2 }}>
                                                            <FormLabel required>{t('video')}</FormLabel>
                                                        </Grid>
                                                        <Grid size={{ xs: 12, sm: 10 }}>
                                                            <VideoField
                                                                value={data.media[mediaKey].file}
                                                                onChange={(file) =>
                                                                    handleUpdateMediaInfo(mediaKey, { file })
                                                                }
                                                                onDeleteVideo={() =>
                                                                    handleUpdateMediaInfo(mediaKey, { file: undefined })
                                                                }
                                                                onError={(errorMessage) =>
                                                                    setError(`media.${mediaKey}.file`, errorMessage)
                                                                }
                                                                error={!!errors[`media.${mediaKey}.file`]}
                                                                helperText={errors[`media.${mediaKey}.file`]}
                                                                maxSize={MaxFileSize.Video}
                                                                disabled={processing}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        {!!data.media_type && mediaKeys.length < mediaCountLimitPerUpload && (
                            <Box>
                                <Button startIcon={<AddIcon />} onClick={handleAddMediaInfoBlock} disabled={processing}>
                                    {t('add_file')} {mediaKeys.length}/{mediaCountLimitPerUpload}
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </CardContent>
                {!!data.media_type && (
                    <Fragment>
                        <Divider sx={{ mt: 4 }} />
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button type="submit" loading={processing}>
                                {t('upload')}
                            </Button>
                        </CardActions>
                    </Fragment>
                )}
            </Card>
        </Stack>
    );
};

export default CreateAlbumMediaPage;
