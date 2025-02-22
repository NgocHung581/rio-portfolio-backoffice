import ImageDropzone from '@/@core/components/ImageDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import BackListButton from '@/Components/BackListButton';
import { Head } from '@inertiajs/react';
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
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const CreateAlbumPage = () => {
    const { t } = useTranslation();

    return (
        <Fragment>
            <Head title={t('add_new_album')} />
            <Stack spacing={6}>
                <Typography variant="h2">{t('add_new_album')}</Typography>
                <Card>
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
                                <TextField label={t('title_en')} required />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                                <TextField label={t('title_vi')} required />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                                <TextField label={t('name_en')} required />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
                                <TextField label={t('name_vi')} required />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormControl required>
                                    <FormLabel>{t('description_en')}</FormLabel>
                                    <TiptapEditor characterLimit={5000} />
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormControl required>
                                    <FormLabel>{t('description_vi')}</FormLabel>
                                    <TiptapEditor characterLimit={5000} />
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormControl required>
                                    <FormLabel>{t('summary_en')}</FormLabel>
                                    <TiptapEditor characterLimit={5000} />
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormControl required>
                                    <FormLabel>{t('summary_vi')}</FormLabel>
                                    <TiptapEditor characterLimit={5000} />
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormControl required>
                                    <FormLabel>{t('image')}</FormLabel>
                                    <ImageDropzone
                                        maxSize={31457280} // NOTE: 30MB
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" alignItems="center" gap={4}>
                                    <FormLabel sx={{ mb: 0 }}>{t('highlight')}</FormLabel>
                                    <Switch />
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button>{t('add')}</Button>
                    </CardActions>
                </Card>
            </Stack>
        </Fragment>
    );
};

export default CreateAlbumPage;
