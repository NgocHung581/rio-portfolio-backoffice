import FileDropzone from '@/@core/components/FileDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import FormField from '@/Components/FormField';
import Image from '@/Components/Image';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
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
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

type FormErrorKeys = 'avatar_file' | `partner_logos.${string}.${string}`;

type PartnerLogoData = {
    id: string;
    file_url: string;
};

type FormData = {
    phone_number: string;
    email: string;
    introduction_en: string;
    introduction_vi: string;
    avatar_file_url: string;
    partner_logos: PartnerLogoData[];
    banner_text_en: string;
    banner_text_vi: string;
} & Partial<Record<FormErrorKeys, string>>;

type WebsiteContentSettingData = {
    phone_number: string;
    email: string;
    introduction_en: string;
    introduction_vi: string;
    banner_text_en: string;
    banner_text_vi: string;
    avatar: { file_path: string; file_url: string };
    partner_logos: { id: string; file_path: string; file_url: string }[];
};

type Props = {
    websiteContentSetting: WebsiteContentSettingData;
};

const IMAGE_SIZE_LIMIT = Number(import.meta.env.VITE_APP_IMAGE_SIZE_LIMIT);
const VALID_IMAGE_MIME_TYPES = Object.fromEntries(
    import.meta.env.VITE_APP_IMAGE_MINE_TYPES.split(',').map((mineType: string) => [mineType, []]),
);

const WebsiteContentSettingPage = ({ websiteContentSetting }: PageProps<Props>) => {
    const { t } = useTranslation();

    const { data, setData, errors, setError, clearErrors, processing, post, wasSuccessful } = useForm<FormData>({
        phone_number: websiteContentSetting.phone_number,
        email: websiteContentSetting.email,
        avatar_file_url: websiteContentSetting.avatar.file_url,
        introduction_en: websiteContentSetting.introduction_en,
        introduction_vi: websiteContentSetting.introduction_vi,
        partner_logos: websiteContentSetting.partner_logos,
        banner_text_en: websiteContentSetting.banner_text_en,
        banner_text_vi: websiteContentSetting.banner_text_vi,
    });

    const [uploadAvatarPercentage, setUploadAvatarPercentage] = useState<number | undefined>(undefined);
    const [uploadPartnerLogoPercentage, setUploadPartnerLogoPercentage] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (wasSuccessful) {
            setData({ ...websiteContentSetting, avatar_file_url: websiteContentSetting.avatar.file_url });
        }
    }, [wasSuccessful]);

    const handleUploadAvatar = (uploadedFile: File) => {
        router.post(
            route('files.upload'),
            { file: uploadedFile },
            {
                showProgress: false,
                preserveScroll: true,
                preserveUrl: true,
                preserveState: true,
                onProgress: (e) => setUploadAvatarPercentage(e?.percentage),
                onStart: () => {
                    setData('avatar_file_url', '');
                    clearErrors('avatar_file', 'avatar_file_url');
                },
                onFinish: () => setUploadAvatarPercentage(undefined),
                onSuccess: (page) => setData('avatar_file_url', page.props.flash['fileUrl'] as string),
                onError: (error) => toast.error(error.message),
            },
        );
    };

    const handleUploadPartnerLogo = (uploadedFile: File) => {
        router.post(
            route('files.upload'),
            { file: uploadedFile },
            {
                showProgress: false,
                preserveScroll: true,
                preserveUrl: true,
                preserveState: true,
                onProgress: (e) => setUploadPartnerLogoPercentage(e?.percentage),
                onStart: () => clearErrors(`partner_logos`),
                onFinish: () => setUploadPartnerLogoPercentage(undefined),
                onSuccess: (page) => {
                    setData('partner_logos', [
                        ...data.partner_logos,
                        { id: uuidv4(), file_url: page.props.flash['fileUrl'] as string },
                    ]);
                },
                onError: (error) => toast.error(error.message),
            },
        );
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('settings.websiteContent.save'), {
            onStart: () => clearErrors(),
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
                                                maxFileSize={IMAGE_SIZE_LIMIT}
                                                accept={VALID_IMAGE_MIME_TYPES}
                                                onUpload={handleUploadAvatar}
                                                disabled={
                                                    processing ||
                                                    uploadAvatarPercentage !== undefined ||
                                                    uploadPartnerLogoPercentage !== undefined
                                                }
                                                onError={(message) => setError('avatar_file', message)}
                                                hasError={!!errors.avatar_file}
                                                progress={uploadAvatarPercentage}
                                            />
                                        }
                                        label={t('avatar')}
                                        required
                                        direction="column"
                                    />
                                    {!!errors[`avatar_file`] && (
                                        <FormHelperText error>{errors[`avatar_file`]}</FormHelperText>
                                    )}
                                </Box>
                                {!!data.avatar_file_url && (
                                    <Stack width={{ xs: 1, sm: '75vw', lg: '50vw' }} gap={4} alignSelf="center">
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Image
                                                    src={data.avatar_file_url}
                                                    containerSx={{ aspectRatio: '3/2' }}
                                                    imageSx={{ width: 1, height: 1 }}
                                                />
                                                {!!errors.avatar_file_url && (
                                                    <FormHelperText error>{errors.avatar_file_url}</FormHelperText>
                                                )}
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'end' }}>
                                                <Button
                                                    color="error"
                                                    disabled={processing}
                                                    onClick={() => setData('avatar_file_url', '')}
                                                >
                                                    {t('delete')}
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Stack>
                                )}
                            </Stack>
                        </Grid>
                        <Grid size={12}>
                            <Stack gap={4}>
                                <Stack>
                                    <FormField
                                        control={
                                            <FileDropzone
                                                maxFileSize={IMAGE_SIZE_LIMIT}
                                                accept={VALID_IMAGE_MIME_TYPES}
                                                onUpload={(selected) => handleUploadPartnerLogo(selected)}
                                                disabled={
                                                    processing ||
                                                    uploadAvatarPercentage !== undefined ||
                                                    uploadPartnerLogoPercentage !== undefined
                                                }
                                                onError={(message) => setError('partner_logos', message)}
                                                hasError={!!errors.partner_logos}
                                                progress={uploadPartnerLogoPercentage}
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
                                        {data.partner_logos.map((partnerLogo) => (
                                            <Grid key={partnerLogo.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{ height: 1, display: 'flex', flexDirection: 'column' }}
                                                >
                                                    <CardContent sx={{ flex: 1 }}>
                                                        <Image
                                                            src={partnerLogo.file_url}
                                                            containerSx={{ aspectRatio: 1, width: 1 }}
                                                            imageSx={{ width: 1, height: 1 }}
                                                        />
                                                        {!!errors[`partner_logos.${partnerLogo.id}.file_url`] && (
                                                            <FormHelperText error>
                                                                {errors[`partner_logos.${partnerLogo.id}.file_url`]}
                                                            </FormHelperText>
                                                        )}
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
                                                                        (item) => item.id !== partnerLogo.id,
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
                                    <TextField
                                        multiline
                                        name="banner_text_en"
                                        value={data.banner_text_en}
                                        onChange={(e) => setData('banner_text_en', e.target.value)}
                                        disabled={processing}
                                        error={!!errors.banner_text_en}
                                        helperText={errors.banner_text_en}
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
                                    <TextField
                                        multiline
                                        name="banner_text_vi"
                                        value={data.banner_text_vi}
                                        onChange={(e) => setData('banner_text_vi', e.target.value)}
                                        disabled={processing}
                                        error={!!errors.banner_text_vi}
                                        helperText={errors.banner_text_vi}
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
