import FormField from '@/Components/FormField';
import Modal from '@/Components/Modal';
import MediaType from '@/enums/media-type';
import { useForm, usePage } from '@inertiajs/react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Fragment, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CategoryListItem, CategoryListPageProps } from '../List';

type RenderTriggerProps = {
    openModal: () => void;
};

type Props = {
    renderTrigger: (props: RenderTriggerProps) => ReactNode;
    category?: CategoryListItem;
};

type CategoryFormData = {
    name_en: string;
    name_vi: string;
    media_type: number;
};

const CategoryFormModal = ({ renderTrigger, category }: Props) => {
    const { t } = useTranslation();
    const { mediaTypeOptions } = usePage<CategoryListPageProps>().props;

    const { data, setData, errors, clearErrors, reset, setDefaults, post, put, processing } = useForm<CategoryFormData>(
        {
            name_en: category?.name_en ?? '',
            name_vi: category?.name_vi ?? '',
            media_type: category?.media_type ?? mediaTypeOptions[0].value,
        },
    );

    const [openModal, setOpenModal] = useState(false);

    // The server keeps the classification of a category in use, since its projects hold that kind of media.
    const isMediaTypeLocked = !!category?.projects_count;

    const handleOpenModal = () => {
        reset();
        clearErrors();
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        if (processing) return;

        setOpenModal(false);
    };

    const handleSave = () => {
        const method = !category ? post : put;
        const url = !category ? route('categories.store') : route('categories.update', category);

        method(url, {
            onStart: () => clearErrors(),
            onSuccess: ({ props: { message } }) => {
                toast.success(message);
                handleCloseModal();
                !!category && setDefaults();
            },
            onError: (error) => toast.error(error.message),
            preserveScroll: true,
        });
    };

    return (
        <Fragment>
            {renderTrigger({ openModal: handleOpenModal })}
            <Modal
                asForm
                open={openModal}
                onClose={handleCloseModal}
                title={!category ? t('add_a_new_category') : t('edit_category')}
                okText={t('save')}
                closeText={t('cancel')}
                onOk={handleSave}
                isLoading={processing}
                maxWidth="sm"
            >
                <Stack gap={5}>
                    <FormField
                        control={
                            <TextField
                                value={data.name_en}
                                onChange={(e) => setData('name_en', e.target.value)}
                                error={!!errors.name_en}
                                helperText={errors.name_en}
                                disabled={processing}
                            />
                        }
                        label={t('name_en')}
                        required
                        direction="column"
                    />
                    <FormField
                        control={
                            <TextField
                                value={data.name_vi}
                                onChange={(e) => setData('name_vi', e.target.value)}
                                error={!!errors.name_vi}
                                helperText={errors.name_vi}
                                disabled={processing}
                            />
                        }
                        label={t('name_vi')}
                        required
                        direction="column"
                    />
                    <Box>
                        <FormLabel id="category-media-type-label" required>
                            {t('classification')}
                        </FormLabel>
                        {/* Each option is a card, so the difference between photos and videos is clear at a glance. */}
                        <RadioGroup
                            aria-labelledby="category-media-type-label"
                            value={data.media_type}
                            onChange={(_, value) => setData('media_type', Number(value))}
                            sx={{
                                mt: 1,
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 3,
                            }}
                        >
                            {mediaTypeOptions.map((option) => {
                                const isVideo = option.value === MediaType.Video;
                                const isSelected = data.media_type === option.value;
                                const isDisabled = processing || isMediaTypeLocked;
                                const color = isVideo ? 'secondary' : 'primary';

                                return (
                                    <Stack
                                        key={option.value}
                                        component="label"
                                        direction="row"
                                        alignItems="flex-start"
                                        gap={3}
                                        p={3}
                                        border={isSelected ? 2 : 1}
                                        borderColor={isSelected ? `${color}.main` : 'divider'}
                                        borderRadius={1}
                                        bgcolor={
                                            isSelected
                                                ? `rgba(var(--mui-palette-${color}-mainChannel) / 0.06)`
                                                : 'background.paper'
                                        }
                                        sx={{
                                            cursor: isDisabled ? 'default' : 'pointer',
                                            opacity: isDisabled && !isSelected ? 0.5 : 1,
                                            // Keep the content in place when the border gets thicker.
                                            m: isSelected ? 0 : '1px',
                                            '&:has(input:focus-visible)': {
                                                outline: `2px solid var(--mui-palette-${color}-main)`,
                                                outlineOffset: 2,
                                            },
                                        }}
                                    >
                                        <Box display="flex" color={`${color}.main`} pt={0.5}>
                                            {isVideo ? <VideocamOutlinedIcon /> : <PhotoCameraOutlinedIcon />}
                                        </Box>
                                        <Box flex={1}>
                                            <Typography fontWeight={600}>{option.label}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {t(
                                                    isVideo
                                                        ? 'media_type_video_description'
                                                        : 'media_type_image_description',
                                                )}
                                            </Typography>
                                        </Box>
                                        <Radio
                                            value={option.value}
                                            color={color}
                                            disabled={isDisabled}
                                            size="small"
                                            sx={{ m: -1 }}
                                        />
                                    </Stack>
                                );
                            })}
                        </RadioGroup>
                        {errors.media_type ? (
                            <FormHelperText error>{errors.media_type}</FormHelperText>
                        ) : (
                            isMediaTypeLocked && (
                                <Stack direction="row" alignItems="center" gap={1.5} mt={2} color="text.secondary">
                                    <LockOutlinedIcon sx={{ fontSize: 16 }} />
                                    <Typography variant="body2" color="inherit">
                                        {t('media_type_locked_hint', { count: category.projects_count })}
                                    </Typography>
                                </Stack>
                            )
                        )}
                    </Box>
                </Stack>
            </Modal>
        </Fragment>
    );
};

export default CategoryFormModal;
