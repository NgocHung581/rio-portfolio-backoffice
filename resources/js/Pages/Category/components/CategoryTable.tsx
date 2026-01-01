import ConfirmationModal, { ConfirmationModalProps } from '@/Components/ConfirmationModal';
import Pagination from '@/Components/Pagination';
import Table from '@/Components/Table';
import { router, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { MRT_RowSelectionState } from 'material-react-table';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useCategoryColumns from '../hooks/useCategoryColumns';
import useCategoryListPage from '../hooks/useCategoryListPage';
import { CategoryListPageProps } from '../List';
import CategoryFormModal from './CategoryFormModal';

const CategoryTable = () => {
    const { t } = useTranslation();
    const { categories, perPageOptions } = usePage<CategoryListPageProps>().props;
    const queryParams = route().queryParams;

    const { isSearching, setIsSearching } = useCategoryListPage();
    const [isDeleting, setIsDeleting] = useState(false);
    const columns = useCategoryColumns();

    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

    const selectedCategoryIds = Object.keys(rowSelection).map(Number);

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
            <Stack direction="row" alignItems="center" gap={4} flexWrap="wrap">
                <ConfirmationModal
                    renderTrigger={({ openModal }) => (
                        <Button
                            color="error"
                            startIcon={<DeleteOutlinedIcon />}
                            onClick={openModal}
                            disabled={isSearching || !selectedCategoryIds.length}
                        >
                            {t('delete')}
                        </Button>
                    )}
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

                <CategoryFormModal
                    renderTrigger={({ openModal }) => (
                        <Button startIcon={<AddIcon />} onClick={openModal} disabled={isSearching}>
                            {t('add')}
                        </Button>
                    )}
                />
            </Stack>
        );
    };

    const renderBottomToolbar = () => {
        return (
            <Stack direction="row" alignContent="center" justifyContent="end">
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
            </Stack>
        );
    };

    return (
        <Table
            columns={columns}
            data={categories.data}
            renderTopToolbar={renderTopToolbar}
            renderBottomToolbar={!!categories.total && renderBottomToolbar}
            enableRowSelection
            positionActionsColumn="last"
            renderRowActions={({ row }) => [
                <CategoryFormModal
                    key={`edit-${row.original.id}`}
                    renderTrigger={({ openModal }) => (
                        <Tooltip title={t('edit')}>
                            <IconButton color="info" size="small" onClick={openModal}>
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
