import ImageDropzone, { SelectedImage } from '@/@core/components/ImageDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import { MaxFileSize } from '@/enums/maxFileSize';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type PartnerLogoImage = {
    url: string;
    file_path: string;
    file_name: string;
    file_size: number;
};

type AboutPageInfo = {
    introduction: string;
    short_introduction: string;
    partner_logo_images: PartnerLogoImage[];
};

type Props = {
    aboutPageInfo: AboutPageInfo;
};

type SettingAboutPagePayload = {
    introduction: string;
    short_introduction: string;
    partner_logo_images: SelectedImage[];
    deleted_partner_logo_image_urls: string[];
};

const SettingAboutPage = ({ aboutPageInfo }: PageProps<Props>) => {
    const { t } = useTranslation();

    const { data, setData, errors, setError, clearErrors, processing, post, reset, wasSuccessful } =
        useForm<SettingAboutPagePayload>({
            introduction: aboutPageInfo.introduction,
            short_introduction: aboutPageInfo.short_introduction,
            partner_logo_images: [],
            deleted_partner_logo_image_urls: [],
        });

    const handleDeleteAllPartnerLogos = () => {
        setData((prev) => ({
            ...prev,
            partner_logos: [],
            deleted_partner_logo_image_urls: aboutPageInfo.partner_logo_images.map((image) => image.file_path),
        }));
    };

    const handleDeletePartnerLogo = (deletedImage: SelectedImage) => {
        const isDeleted = aboutPageInfo.partner_logo_images.some((image) => image.url === deletedImage.url);

        setData((prev) => ({
            ...prev,
            partner_logos: data.partner_logo_images.filter((file) => file.url !== deletedImage.url),
            ...(isDeleted && {
                deleted_partner_logo_image_urls: [...prev.deleted_partner_logo_image_urls, deletedImage.url],
            }),
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();
        post(route('settingAboutPage.save'), {
            onSuccess: ({ props: { message } }) => {
                toast.success(message);
                reset();
            },
            onError: (error) => toast.error(error.message),
        });
    };

    return (
        <Stack spacing={6}>
            <Head title={t('setting_about_page')} />
            <Typography variant="h1">{t('setting_about_page')}</Typography>
            <Card component="form" onSubmit={handleSubmit}>
                <CardContent>
                    <Stack spacing={4}>
                        <TextField
                            multiline
                            minRows={2}
                            maxRows={5}
                            name="short_introduction"
                            label={t('short_introduction')}
                            value={data.short_introduction}
                            onChange={(e) => setData('short_introduction', e.target.value)}
                            error={!!errors.short_introduction}
                            helperText={errors.short_introduction}
                        />
                        <FormControl required>
                            <FormLabel>{t('introduction')}</FormLabel>
                            <TiptapEditor
                                characterLimit={5000}
                                value={data.introduction}
                                onChange={(content) => setData('introduction', content)}
                                disabled={processing}
                                error={!!errors.introduction}
                                helperText={errors.introduction}
                                height={500}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>{t('partner_logos')}</FormLabel>
                            <ImageDropzone
                                multiple
                                maxFiles={10}
                                maxSize={MaxFileSize.Image}
                                onChange={(files) => setData('partner_logo_images', files)}
                                onDeleteAllImages={handleDeleteAllPartnerLogos}
                                onDeleteImage={handleDeletePartnerLogo}
                                onError={(errorMessage) => setError('partner_logo_images', errorMessage)}
                                error={!!errors.partner_logo_images}
                                helperText={errors.partner_logo_images}
                                disabled={processing}
                                shouldReset={wasSuccessful}
                                initImages={aboutPageInfo.partner_logo_images}
                            />
                        </FormControl>
                    </Stack>
                </CardContent>
                <Divider sx={{ mt: 4 }} />
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button type="submit" loading={processing}>
                        {t('save')}
                    </Button>
                </CardActions>
            </Card>
        </Stack>
    );
};

export default SettingAboutPage;
