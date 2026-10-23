import FileDropzone from '@/@core/components/FileDropzone';
import TiptapEditor from '@/@core/components/TiptapEditor';
import FormActionBar from '@/Components/FormActionBar';
import FormField from '@/Components/FormField';
import Image from '@/Components/Image';
import LanguageTabs, { findLanguageToShow, OtherLanguageErrorAlerts } from '@/Components/LanguageTabs';
import LeavePageConfirmation from '@/Components/LeavePageConfirmation';
import SortableItem, { moveArrayItem, SortableHandle } from '@/Components/SortableItem';
import { Language } from '@/enums/language';
import { PageProps } from '@/types';
import { describeFileRequirements } from '@/utils/file';
import { Head, router, useForm } from '@inertiajs/react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

type FormErrorKeys = 'avatar_file' | 'avatar_file_url' | `partner_logos.${string}.${string}`;

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
const IMAGE_MIME_TYPES: string[] = import.meta.env.VITE_APP_IMAGE_MINE_TYPES.split(',');
const VALID_IMAGE_MIME_TYPES = Object.fromEntries(IMAGE_MIME_TYPES.map((mineType) => [mineType, []]));
const BANNER_TEXT_MAX_LENGTH = 200;
const TRANSLATABLE_FIELDS = ['banner_text', 'introduction'] as const;
const PARTNER_LOGOS_SORTABLE_GROUP = 'partner-logos';

const toFormData = (setting: WebsiteContentSettingData): FormData => ({
    phone_number: setting.phone_number,
    email: setting.email,
    avatar_file_url: setting.avatar.file_url,
    introduction_en: setting.introduction_en,
    introduction_vi: setting.introduction_vi,
    partner_logos: setting.partner_logos.map(({ id, file_url }) => ({ id, file_url })),
    banner_text_en: setting.banner_text_en,
    banner_text_vi: setting.banner_text_vi,
});

const sectionHeaderProps: Pick<CardHeaderProps, 'slotProps'> = {
    slotProps: {
        title: { variant: 'h4', component: 'h2' },
        subheader: { variant: 'body2' },
    },
};

const deleteOverlayButtonSx = {
    position: 'absolute',
    top: 6,
    right: 6,
    bgcolor: 'background.paper',
    boxShadow: 1,
    '&:hover': { bgcolor: 'background.paper', color: 'error.main' },
} as const;

const WebsiteContentSettingPage = ({ websiteContentSetting }: PageProps<Props>) => {
    const { t } = useTranslation();

    const { data, setData, setDefaults, errors, setError, clearErrors, processing, post, isDirty } = useForm<FormData>(
        toFormData(websiteContentSetting),
    );

    const [contentLanguage, setContentLanguage] = useState<Language>(Language.English);
    const [uploadAvatarPercentage, setUploadAvatarPercentage] = useState<number | undefined>(undefined);
    const [uploadPartnerLogoPercentage, setUploadPartnerLogoPercentage] = useState<number | undefined>(undefined);

    const errorMessages = errors as Partial<Record<string, string>>;
    const hasErrors = Object.keys(errors).some((key) => key !== 'message');
    const isUploading = uploadAvatarPercentage !== undefined || uploadPartnerLogoPercentage !== undefined;
    const isPartnerLogosSortable = data.partner_logos.length > 1;
    const imageRequirements = t('file_requirements', describeFileRequirements(IMAGE_MIME_TYPES, IMAGE_SIZE_LIMIT));

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

    const handleSortPartnerLogos = (fromIndex: number, toIndex: number) => {
        setData('partner_logos', moveArrayItem(data.partner_logos, fromIndex, toIndex));
    };

    const handleDeletePartnerLogo = (partnerLogoId: string) => {
        setData(
            'partner_logos',
            data.partner_logos.filter((partnerLogo) => partnerLogo.id !== partnerLogoId),
        );
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('settings.websiteContent.save'), {
            onStart: () => clearErrors(),
            onSuccess: (page) => {
                // The server moves uploaded files out of temporary storage, so take the saved values as the new baseline.
                const savedData = toFormData(page.props.websiteContentSetting as WebsiteContentSettingData);

                setData(savedData);
                setDefaults(savedData);
                toast.success(page.props.message);
            },
            onError: (error) => {
                toast.error(error.message);
                setContentLanguage(findLanguageToShow(error, TRANSLATABLE_FIELDS, contentLanguage));
            },
        });
    };

    const renderTranslatableFields = (language: Language) => {
        const bannerTextKey = `banner_text_${language}` as const;
        const introductionKey = `introduction_${language}` as const;
        const bannerTextLength = data[bannerTextKey].length;

        return (
            <>
                <FormField
                    control={
                        <TextField
                            multiline
                            minRows={2}
                            value={data[bannerTextKey]}
                            onChange={(e) => setData(bannerTextKey, e.target.value)}
                            disabled={processing}
                            error={!!errors[bannerTextKey] || bannerTextLength > BANNER_TEXT_MAX_LENGTH}
                            helperText={
                                errors[bannerTextKey] ??
                                t('character_count', { count: bannerTextLength, max: BANNER_TEXT_MAX_LENGTH })
                            }
                        />
                    }
                    label={t('welcome_message')}
                    required
                    direction="column"
                />
                <FormField
                    control={
                        <TiptapEditor
                            characterLimit={5000}
                            value={data[introductionKey]}
                            onChange={(content) => setData(introductionKey, content)}
                            disabled={processing}
                            error={!!errors[introductionKey]}
                            helperText={errors[introductionKey]}
                            height={400}
                        />
                    }
                    label={t('introduction')}
                    required
                    direction="column"
                />
            </>
        );
    };

    return (
        <Stack gap={{ xs: 4, sm: 6 }}>
            <Head title={t('website_content_setting')} />
            <Stack component="header" gap={2}>
                <Typography variant="h1">{t('website_content_setting')}</Typography>
                <Typography color="textSecondary" maxWidth="65ch">
                    {t('website_content_setting_description')}
                </Typography>
            </Stack>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <LeavePageConfirmation when={isDirty && !processing} />
                <Grid container spacing={6}>
                    {/* Introduction: the words visitors read first, one language at a time. */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Card>
                            <CardHeader
                                title={t('introduction')}
                                subheader={t('introduction_section_description')}
                                {...sectionHeaderProps}
                            />
                            <LanguageTabs
                                value={contentLanguage}
                                onChange={setContentLanguage}
                                errors={errorMessages}
                                fields={TRANSLATABLE_FIELDS}
                            />
                            <CardContent>
                                <Stack gap={6} pt={2}>
                                    <OtherLanguageErrorAlerts
                                        value={contentLanguage}
                                        onChange={setContentLanguage}
                                        errors={errorMessages}
                                        fields={TRANSLATABLE_FIELDS}
                                    />
                                    <Stack key={contentLanguage} gap={6}>
                                        {renderTranslatableFields(contentLanguage)}
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Stack gap={6}>
                            {/* Avatar: previewed in the same 3:2 frame it is shown in on the website. */}
                            <Card>
                                <CardHeader
                                    title={
                                        <FormLabel required component="span" sx={{ font: 'inherit', color: 'inherit' }}>
                                            {t('avatar')}
                                        </FormLabel>
                                    }
                                    subheader={t('avatar_description')}
                                    {...sectionHeaderProps}
                                />
                                <CardContent>
                                    {data.avatar_file_url ? (
                                        <Box
                                            position="relative"
                                            overflow="hidden"
                                            borderRadius={1}
                                            border={1}
                                            borderColor={errors.avatar_file_url ? 'error.main' : 'divider'}
                                        >
                                            <Image
                                                src={data.avatar_file_url}
                                                alt={t('avatar')}
                                                containerSx={{ aspectRatio: '3/2' }}
                                                imageSx={{ width: 1, height: 1, objectFit: 'cover', display: 'block' }}
                                            />
                                            <Tooltip title={t('delete')}>
                                                <IconButton
                                                    size="small"
                                                    aria-label={t('delete')}
                                                    onClick={() => setData('avatar_file_url', '')}
                                                    disabled={processing}
                                                    sx={deleteOverlayButtonSx}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    ) : (
                                        <Box sx={{ aspectRatio: '3/2' }}>
                                            <FileDropzone
                                                compact
                                                height="100%"
                                                maxFileSize={IMAGE_SIZE_LIMIT}
                                                accept={VALID_IMAGE_MIME_TYPES}
                                                onUpload={handleUploadAvatar}
                                                disabled={processing || isUploading}
                                                onError={(message) => setError('avatar_file', message)}
                                                hasError={!!errors.avatar_file}
                                                progress={uploadAvatarPercentage}
                                            />
                                        </Box>
                                    )}
                                    {errors.avatar_file || errors.avatar_file_url ? (
                                        <FormHelperText error>
                                            {errors.avatar_file ?? errors.avatar_file_url}
                                        </FormHelperText>
                                    ) : (
                                        !data.avatar_file_url && <FormHelperText>{imageRequirements}</FormHelperText>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact: how visitors reach out. */}
                            <Card>
                                <CardHeader
                                    title={t('contact')}
                                    subheader={t('contact_description')}
                                    {...sectionHeaderProps}
                                />
                                <CardContent>
                                    <Stack gap={5}>
                                        <FormField
                                            control={
                                                <TextField
                                                    type="email"
                                                    name="email"
                                                    autoComplete="email"
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
                                        <FormField
                                            control={
                                                <TextField
                                                    type="tel"
                                                    name="phone_number"
                                                    autoComplete="tel"
                                                    value={data.phone_number}
                                                    onChange={(e) => setData('phone_number', e.target.value)}
                                                    disabled={processing}
                                                    error={!!errors.phone_number}
                                                    helperText={errors.phone_number ?? t('phone_number_hint')}
                                                    slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                                                />
                                            }
                                            label={t('phone_number')}
                                            required
                                            direction="column"
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Partner logos: a logo wall, with each logo kept in its original shape. */}
                    <Grid size={12}>
                        <Card>
                            <CardHeader
                                title={t('partner_logos')}
                                subheader={t('partner_logos_description')}
                                action={
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mr: 2 }}>
                                        {t('logos_count', { count: data.partner_logos.length })}
                                    </Typography>
                                }
                                {...sectionHeaderProps}
                            />
                            <CardContent>
                                <Box
                                    display="grid"
                                    gap={{ xs: 2, sm: 3 }}
                                    p={{ xs: 2, sm: 3 }}
                                    bgcolor="action.hover"
                                    borderRadius={1}
                                    sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
                                >
                                    {data.partner_logos.map((partnerLogo, index) => {
                                        const fileUrlError = errorMessages[`partner_logos.${partnerLogo.id}.file_url`];

                                        return (
                                            <SortableItem
                                                key={partnerLogo.id}
                                                group={PARTNER_LOGOS_SORTABLE_GROUP}
                                                index={index}
                                                onSort={handleSortPartnerLogos}
                                                disabled={processing || !isPartnerLogosSortable}
                                            >
                                                <Box
                                                    position="relative"
                                                    bgcolor="background.paper"
                                                    border={1}
                                                    borderColor={fileUrlError ? 'error.main' : 'divider'}
                                                    borderRadius={1}
                                                >
                                                    <Image
                                                        src={partnerLogo.file_url}
                                                        alt={t('partner_logo')}
                                                        containerSx={{ aspectRatio: 1, p: 4 }}
                                                        imageSx={{
                                                            width: 1,
                                                            height: 1,
                                                            objectFit: 'contain',
                                                            display: 'block',
                                                        }}
                                                        skeletonSx={{ borderRadius: 1 }}
                                                    />
                                                    {isPartnerLogosSortable && (
                                                        <Box
                                                            position="absolute"
                                                            top={6}
                                                            left={6}
                                                            display="flex"
                                                            p={0.5}
                                                            bgcolor="background.paper"
                                                            borderRadius="50%"
                                                            boxShadow={1}
                                                        >
                                                            <SortableHandle
                                                                group={PARTNER_LOGOS_SORTABLE_GROUP}
                                                                disabled={processing}
                                                            />
                                                        </Box>
                                                    )}
                                                    <Tooltip title={t('delete')}>
                                                        <IconButton
                                                            size="small"
                                                            aria-label={t('delete')}
                                                            onClick={() => handleDeletePartnerLogo(partnerLogo.id)}
                                                            disabled={processing}
                                                            sx={deleteOverlayButtonSx}
                                                        >
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                                {!!fileUrlError && (
                                                    <FormHelperText error sx={{ m: 0, mt: 1 }}>
                                                        {fileUrlError}
                                                    </FormHelperText>
                                                )}
                                            </SortableItem>
                                        );
                                    })}
                                    <Box sx={{ aspectRatio: 1 }}>
                                        <FileDropzone
                                            compact
                                            height="100%"
                                            maxFileSize={IMAGE_SIZE_LIMIT}
                                            accept={VALID_IMAGE_MIME_TYPES}
                                            onUpload={handleUploadPartnerLogo}
                                            disabled={processing || isUploading}
                                            onError={(message) => setError('partner_logos', message)}
                                            hasError={!!errors.partner_logos}
                                            progress={uploadPartnerLogoPercentage}
                                        />
                                    </Box>
                                </Box>
                                <FormHelperText error={!!errors.partner_logos}>
                                    {errors.partner_logos ?? imageRequirements}
                                </FormHelperText>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <FormActionBar hasErrors={hasErrors}>
                    <Button type="submit" loading={processing} disabled={!isDirty}>
                        {t('save')}
                    </Button>
                </FormActionBar>
            </Box>
        </Stack>
    );
};

export default WebsiteContentSettingPage;
