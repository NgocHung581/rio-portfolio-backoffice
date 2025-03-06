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

type AboutPageInformation = {
    description: string;
    partner_logos: PartnerLogoImage[];
};

type Props = {
    aboutPageInformation: AboutPageInformation;
};

type SettingAboutPagePayload = {
    description: string;
    partner_logos: SelectedImage[];
    deleted_partner_logo_urls: string[];
};

const SettingAboutPage = ({ aboutPageInformation }: PageProps<Props>) => {
    const { t } = useTranslation();

    const { data, setData, errors, setError, clearErrors, processing, post, reset, wasSuccessful } =
        useForm<SettingAboutPagePayload>({
            description: aboutPageInformation.description,
            partner_logos: [],
            deleted_partner_logo_urls: [],
        });

    const handleDeleteAllPartnerLogos = () => {
        setData((prev) => ({
            ...prev,
            partner_logos: [],
            deleted_partner_logo_urls: aboutPageInformation.partner_logos.map((image) => image.url),
        }));
    };

    const handleDeletePartnerLogo = (deletedImage: SelectedImage) => {
        const isDeleted = aboutPageInformation.partner_logos.some((image) => image.url === deletedImage.url);

        setData((prev) => ({
            ...prev,
            partner_logos: data.partner_logos.filter((file) => file.url !== deletedImage.url),
            ...(isDeleted && { deleted_partner_logo_urls: [...prev.deleted_partner_logo_urls, deletedImage.url] }),
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
                        <FormControl required>
                            <FormLabel>{t('description')}</FormLabel>
                            <TiptapEditor
                                characterLimit={5000}
                                value={data.description}
                                onChange={(content) => setData('description', content)}
                                disabled={processing}
                                error={!!errors.description}
                                helperText={errors.description}
                                height={500}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>{t('partner_logos')}</FormLabel>
                            <ImageDropzone
                                multiple
                                maxFiles={10}
                                maxSize={MaxFileSize.Image}
                                onChange={(files) => setData('partner_logos', files)}
                                onDeleteAllImages={handleDeleteAllPartnerLogos}
                                onDeleteImage={handleDeletePartnerLogo}
                                onError={(errorMessage) => setError('partner_logos', errorMessage)}
                                error={!!errors.partner_logos}
                                helperText={errors.partner_logos}
                                disabled={processing}
                                shouldReset={wasSuccessful}
                                initImages={aboutPageInformation.partner_logos}
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
