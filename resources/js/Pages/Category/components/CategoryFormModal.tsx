import FormField from '@/Components/FormField';
import Modal from '@/Components/Modal';
import { Category } from '@/types/category';
import { useForm, usePage } from '@inertiajs/react';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Fragment, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CategoryListPageProps } from '../List';

type RenderTriggerProps = {
    openModal: () => void;
};

type Props = {
    renderTrigger: (props: RenderTriggerProps) => ReactNode;
    category?: Category;
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

    const handleOpenModal = () => {
        reset();
        clearErrors();
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        if (processing) return;

        setOpenModal(false);
    };

    const updateFormField = (name: keyof CategoryFormData, value: CategoryFormData[keyof CategoryFormData]) => {
        const numericFieldNames: (keyof CategoryFormData)[] = ['media_type'];

        numericFieldNames.forEach((numericFieldName) => {
            if (name === numericFieldName && !isNaN(Number(value))) {
                value = Number(value);
            }
        });

        setData(name, value);
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
                open={openModal}
                onClose={handleCloseModal}
                title={!category ? t('add_a_new_category') : t('edit_category')}
                okText={t('save')}
                closeText={t('cancel')}
                onOk={handleSave}
                isLoading={processing}
            >
                <Stack gap={4}>
                    <FormField
                        control={
                            <TextField
                                fullWidth
                                value={data.name_en}
                                onChange={(e) => updateFormField('name_en', e.target.value)}
                                error={!!errors.name_en}
                                helperText={errors.name_en}
                                disabled={processing}
                            />
                        }
                        label={t('name_en')}
                        required
                        labelSize={{ lg: 4 }}
                        controlSize={{ lg: 8 }}
                    />
                    <FormField
                        control={
                            <TextField
                                fullWidth
                                value={data.name_vi}
                                onChange={(e) => updateFormField('name_vi', e.target.value)}
                                error={!!errors.name_vi}
                                helperText={errors.name_vi}
                                disabled={processing}
                            />
                        }
                        label={t('name_vi')}
                        required
                        labelSize={{ lg: 4 }}
                        controlSize={{ lg: 8 }}
                    />
                    <FormField
                        control={
                            <Fragment>
                                <RadioGroup
                                    value={data.media_type}
                                    onChange={(_, value) => updateFormField('media_type', value)}
                                    sx={{ flexDirection: 'row' }}
                                >
                                    {mediaTypeOptions.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.value}
                                            control={<Radio />}
                                            label={option.label}
                                            disabled={processing}
                                        />
                                    ))}
                                </RadioGroup>
                                {!!errors.media_type && <FormHelperText error>{errors.media_type}</FormHelperText>}
                            </Fragment>
                        }
                        label={t('media_type')}
                        required
                        labelSize={{ lg: 4 }}
                        controlSize={{ lg: 8 }}
                    />
                </Stack>
            </Modal>
        </Fragment>
    );
};

export default CategoryFormModal;
