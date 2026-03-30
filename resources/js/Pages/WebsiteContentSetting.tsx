import FileDropzone, { UploadedFile } from '@/@core/components/FileDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import FormField from '@/Components/FormField';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type SelectedFile = UploadedFile & {
    file_path: string;
};

type WebsiteContentSettingFormData = {
    phone_number: string;
    email: string;
    introduction_en: string;
    introduction_vi: string;
    avatar: SelectedFile | undefined;
    partner_logos: SelectedFile[];
    banner_text_en: string;
    banner_text_vi: string;
};

type Props = {
    websiteContentSetting: WebsiteContentSettingFormData;
};

const WebsiteContentSettingPage = ({ websiteContentSetting }: PageProps<Props>) => {
    const { t } = useTranslation();

    const { data, setData, errors, setError, clearErrors, processing, post, wasSuccessful } =
        useForm<WebsiteContentSettingFormData>({
            phone_number: websiteContentSetting.phone_number,
            email: websiteContentSetting.email,
            avatar: websiteContentSetting.avatar,
            introduction_en: websiteContentSetting.introduction_en,
            introduction_vi: websiteContentSetting.introduction_vi,
            partner_logos: websiteContentSetting.partner_logos,
            banner_text_en: websiteContentSetting.banner_text_en,
            banner_text_vi: websiteContentSetting.banner_text_vi,
        });

    useEffect(() => {
        if (wasSuccessful) {
            setData(websiteContentSetting);
        }
    }, [wasSuccessful]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        post(route('settings.websiteContent.save'), {
            onSuccess: ({ props: { message } }) => toast.success(message),
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Stack gap={{ xs: 4, sm: 6 }}>
            <Head title={t('website_content_setting')} />
            <Typography variant="h1">{t('website_content_setting')}</Typography>
            <Card component="form" onSubmit={handleSubmit} sx={{ overflow: 'visible' }}>
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TextField
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                    />
                                }
                                label={t('email')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TextField
                                        name="phone_number"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        disabled={processing}
                                        error={!!errors.phone_number}
                                        helperText={errors.phone_number}
                                    />
                                }
                                label={t('phone_number')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TiptapEditor
                                        characterLimit={5000}
                                        value={data.introduction_en}
                                        onChange={(content) => setData('introduction_en', content)}
                                        disabled={processing}
                                        error={!!errors.introduction_en}
                                        helperText={errors.introduction_en}
                                        height={400}
                                    />
                                }
                                label={t('introduction_en')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TiptapEditor
                                        characterLimit={5000}
                                        value={data.introduction_vi}
                                        onChange={(content) => setData('introduction_vi', content)}
                                        disabled={processing}
                                        error={!!errors.introduction_vi}
                                        helperText={errors.introduction_vi}
                                        height={400}
                                    />
                                }
                                label={t('introduction_vi')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={12}>
                            <Stack gap={4}>
                                <Box>
                                    <FormField
                                        control={
                                            <FileDropzone
                                                maxFileSize={Number(import.meta.env.VITE_APP_IMAGE_SIZE_LIMIT)}
                                                accept={Object.fromEntries(
                                                    import.meta.env.VITE_APP_IMAGE_MINE_TYPES.split(',').map(
                                                        (mineType: string) => [mineType, []],
                                                    ),
                                                )}
                                                file={data.avatar}
                                                onUpload={(selected) =>
                                                    setData('avatar', { ...selected, file_path: '' })
                                                }
                                                disabled={processing}
                                                onError={(message) => setError('avatar', message)}
                                                hasError={!!errors.avatar}
                                            />
                                        }
                                        label={t('avatar')}
                                        required
                                        direction="column"
                                    />
                                    {!!errors.avatar && <FormHelperText error>{errors.avatar}</FormHelperText>}
                                </Box>
                                {!!data.avatar && (
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Box
                                                component="img"
                                                src={data.avatar.url}
                                                mx="auto"
                                                sx={{ aspectRatio: '3/2' }}
                                            />
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'center' }}>
                                            <Box>
                                                <Button
                                                    fullWidth
                                                    color="error"
                                                    disabled={processing}
                                                    onClick={() => setData('avatar', undefined)}
                                                >
                                                    {t('delete')}
                                                </Button>
                                            </Box>
                                        </CardActions>
                                    </Card>
                                )}
                            </Stack>
                        </Grid>
                        <Grid size={12}>
                            <Stack gap={4}>
                                <Stack>
                                    <FormField
                                        control={
                                            <FileDropzone
                                                multiple
                                                maxFileSize={Number(import.meta.env.VITE_APP_IMAGE_SIZE_LIMIT)}
                                                accept={Object.fromEntries(
                                                    import.meta.env.VITE_APP_IMAGE_MINE_TYPES.split(',').map(
                                                        (mineType: string) => [mineType, []],
                                                    ),
                                                )}
                                                files={data.partner_logos.map((file) => ({
                                                    file: undefined,
                                                    url: file.url,
                                                }))}
                                                onUpload={(selected) =>
                                                    setData('partner_logos', [
                                                        ...data.partner_logos,
                                                        ...selected.map((item) => ({ ...item, file_path: '' })),
                                                    ])
                                                }
                                                disabled={processing}
                                                onError={(message) => setError('partner_logos', message)}
                                                hasError={!!errors.partner_logos}
                                            />
                                        }
                                        label={t('partner_logos')}
                                        direction="column"
                                    />
                                    {!!errors.partner_logos && (
                                        <FormHelperText error>{errors.partner_logos}</FormHelperText>
                                    )}
                                </Stack>
                                {!!data.partner_logos.length && (
                                    <Grid container spacing={2}>
                                        {data.partner_logos.map((file) => (
                                            <Grid key={file.url} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Box
                                                            component="img"
                                                            src={file.url}
                                                            width={100}
                                                            mx="auto"
                                                            sx={{ aspectRatio: 1 }}
                                                        />
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button
                                                            fullWidth
                                                            color="error"
                                                            disabled={processing}
                                                            onClick={() =>
                                                                setData(
                                                                    'partner_logos',
                                                                    data.partner_logos.filter(
                                                                        (item) => item.url !== file.url,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            {t('delete')}
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TiptapEditor
                                        characterLimit={5000}
                                        value={data.banner_text_en}
                                        onChange={(content) => setData('banner_text_en', content)}
                                        disabled={processing}
                                        error={!!errors.banner_text_en}
                                        helperText={errors.banner_text_en}
                                        height={400}
                                    />
                                }
                                label={t('welcome_message_en')}
                                required
                                direction="column"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormField
                                control={
                                    <TiptapEditor
                                        characterLimit={5000}
                                        value={data.banner_text_vi}
                                        onChange={(content) => setData('banner_text_vi', content)}
                                        disabled={processing}
                                        error={!!errors.banner_text_vi}
                                        helperText={errors.banner_text_vi}
                                        height={400}
                                    />
                                }
                                label={t('welcome_message_vi')}
                                required
                                direction="column"
                            />
                        </Grid>
                    </Grid>
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

export default WebsiteContentSettingPage;
