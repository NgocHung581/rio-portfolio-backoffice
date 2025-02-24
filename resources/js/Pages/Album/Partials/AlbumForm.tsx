import ImageDropzone from '@/@core/components/ImageDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import BackListButton from '@/Components/BackListButton';
import { Album, AlbumFormPayload } from '@/types/album';
import { useForm } from '@inertiajs/react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type Props = {
    album?: Album;
};

const AlbumForm = ({ album }: Props) => {
    const { t } = useTranslation();
    const { data, setData, errors, setError, clearErrors, post, processing, reset, setDefaults } =
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
            is_highlight: album?.is_highlight ?? false,
            ...(!!album && { is_thumbnail_deleted: false }),
        });

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
                    <Stack direction="row" alignItems="center" justifyContent="end">
                        <BackListButton href={route('albums.index')} />
                    </Stack>
                }
            />
            <Divider />
            <CardContent>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                        <TextField
                            label={t('title_en')}
                            slotProps={{ inputLabel: { required: true } }}
                            name="title_en"
                            value={data.title_en}
                            onChange={handleChangeInput}
                            disabled={processing}
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
                            disabled={processing}
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
                            disabled={processing}
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
                            disabled={processing}
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
                                disabled={processing}
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
                                disabled={processing}
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
                                disabled={processing}
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
                                disabled={processing}
                                error={!!errors.summary_vi}
                                helperText={errors.summary_vi}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <FormControl required>
                            <FormLabel>{t('thumbnail')}</FormLabel>
                            <ImageDropzone
                                maxSize={31457280} // NOTE: 30MB
                                onChange={(file) => setData('thumbnail_file', file)}
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
                                disabled={processing}
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
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" alignItems="center" gap={4}>
                            <FormLabel sx={{ mb: 0 }}>{t('highlight')}</FormLabel>
                            <Switch
                                disabled={processing}
                                checked={data.is_highlight}
                                onChange={(_, isChecked) => setData('is_highlight', isChecked)}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'center' }}>
                <Button type="submit" loading={processing}>
                    {!album ? t('add') : t('save')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default AlbumForm;
