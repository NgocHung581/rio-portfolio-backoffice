import { Category } from '@/types/category';
import { usePage } from '@inertiajs/react';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { MRT_ColumnDef } from 'material-react-table';
import { useTranslation } from 'react-i18next';
import { CategoryListPageProps } from '../List';

const useCategoryColumns = (): MRT_ColumnDef<Category>[] => {
    const { t } = useTranslation();
    const { locale, mediaTypeOptions, webVisibilityOptions } = usePage<CategoryListPageProps>().props;

    return [
        {
            header: t('category'),
            accessorKey: 'category',
            Cell: ({ row }) => <Typography>{row.original[`name_${locale}`]}</Typography>,
        },
        {
            header: t('media_type'),
            accessorKey: 'media_type',
            Cell: ({ row }) => (
                <Typography>
                    {mediaTypeOptions.find((option) => option.value === row.original.media_type)?.label}
                </Typography>
            ),
        },
        {
            header: t('web_visibility'),
            accessorKey: 'web_visibility',
            Cell: ({ row }) => {
                const webVisibilityOption = webVisibilityOptions.find(
                    (option) => option.value === row.original.web_visibility,
                );

                return <Chip label={webVisibilityOption?.label} color={webVisibilityOption?.color} />;
            },
        },
    ];
};

export default useCategoryColumns;
