import ConfirmationModal, { ConfirmationModalProps } from '@/Components/ConfirmationModal';
import Pagination from '@/Components/Pagination';
import Table from '@/Components/Table';
import { router, usePage } from '@inertiajs/react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { MRT_RowSelectionState, MRT_SelectCheckbox } from 'material-react-table';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useCategoryColumns from '../hooks/useCategoryColumns';
import useCategoryListPage from '../hooks/useCategoryListPage';
import { CategoryListPageProps } from '../List';
import CategoryFormModal from './CategoryFormModal';
import CategorySearchForm from './CategorySearchForm';

const CategoryTable = () => {
    const { t } = useTranslation();
    const { categories, perPageOptions } = usePage<CategoryListPageProps>().props;

    const { isSearching, setIsSearching } = useCategoryListPage();
    const columns = useCategoryColumns();

    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [isDeleting, setIsDeleting] = useState(false);

    const selectedCategoryIds = Object.keys(rowSelection).map(Number);
    const queryParams = route().queryParams;

    const handleChangePage = (selectedPage: number) => {
        router.get(
            route('categories.index'),
            { ...queryParams, page: selectedPage },
            { onStart: () => setIsSearching(true), onFinish: () => setIsSearching(false) },
        );
    };

    const handleChangePerPage = (perPage: number) => {
        router.get(
            route('categories.index'),
            { ...queryParams, per_page: perPage, page: 1 },
            { onStart: () => setIsSearching(true), onFinish: () => setIsSearching(false) },
        );
    };

    const handleDelete: ConfirmationModalProps['onConfirm'] = ({ closeModal }) => {
        router.post(
            route('categories.bulkDelete'),
            { ids: selectedCategoryIds },
            {
                onStart: () => setIsDeleting(true),
                onFinish: () => setIsDeleting(false),
                onSuccess: ({ props: { message } }) => {
                    toast.success(message);
                    closeModal();
                    setRowSelection({});
                },
                onError: (error) => toast.error(error.message),
                preserveScroll: true,
            },
        );
    };

    const renderTopToolbar = () => {
        return (
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={4} flexWrap="wrap">
                <CategorySearchForm />
                <ConfirmationModal
                    renderTrigger={({ openModal }) =>
                        !!selectedCategoryIds.length && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteOutlinedIcon />}
                                onClick={openModal}
                                disabled={isSearching}
                            >
                                {t('delete_selected', { count: selectedCategoryIds.length })}
                            </Button>
                        )
                    }
                    content={
                        <DialogContentText>
                            <Trans
                                i18nKey="deletion_confirmation"
                                count={selectedCategoryIds.length}
                                values={{ count: selectedCategoryIds.length }}
                                components={{
                                    warning: <Typography component="span" fontWeight={500} color="error" />,
                                }}
                            />
                        </DialogContentText>
                    }
                    onConfirm={handleDelete}
                    isLoading={isDeleting}
                />
            </Stack>
        );
    };

    const renderBottomToolbar = () => {
        return (
            <Pagination
                totalPages={categories.last_page}
                page={categories.current_page}
                onChange={handleChangePage}
                from={categories.from}
                to={categories.to}
                total={categories.total}
                perPage={categories.per_page}
                perPageOptions={perPageOptions}
                onChangePerPage={handleChangePerPage}
                disabled={isSearching}
            />
        );
    };

    return (
        <Table
            columns={columns}
            data={categories.data}
            renderTopToolbar={renderTopToolbar}
            renderBottomToolbar={!!categories.total && renderBottomToolbar}
            // A category that still has projects cannot be deleted, so it cannot be selected either.
            enableRowSelection={(row) => !row.original.projects_count}
            displayColumnDefOptions={{
                'mrt-row-select': {
                    Cell: ({ row, table }) =>
                        row.original.projects_count ? (
                            // A disabled checkbox ignores the pointer, so the wrapper receives the hover instead.
                            <Tooltip title={t('category_has_projects_cannot_delete')}>
                                <Box component="span" display="inline-flex">
                                    <MRT_SelectCheckbox row={row} table={table} />
                                </Box>
                            </Tooltip>
                        ) : (
                            <MRT_SelectCheckbox row={row} table={table} />
                        ),
                },
            }}
            positionActionsColumn="last"
            renderRowActions={({ row }) => [
                <CategoryFormModal
                    key={`edit-${row.original.id}`}
                    renderTrigger={({ openModal }) => (
                        <Tooltip title={t('edit')}>
                            <IconButton color="info" size="small" onClick={openModal} aria-label={t('edit')}>
                                <EditOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    category={row.original}
                />,
            ]}
            getRowId={(row) => row.id.toString()}
            state={{ isLoading: isSearching, rowSelection }}
            onRowSelectionChange={setRowSelection}
        />
    );
};

export default CategoryTable;
