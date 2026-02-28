import ConfirmationModal, { ConfirmationModalProps } from '@/Components/ConfirmationModal';
import Pagination from '@/Components/Pagination';
import Table from '@/Components/Table';
import { Link, router, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
import useProjectColumns from '../hooks/useProjectColumns';
import useProjectListPage from '../hooks/useProjectListPage';
import { ProjectListPageProps } from '../List';
import ProjectViewModal from './ProjectViewModal';

const ProjectTable = () => {
    const { t } = useTranslation();
    const { projects, perPageOptions, locale } = usePage<ProjectListPageProps>().props;

    const { isSearching, setIsSearching } = useProjectListPage();
    const columns = useProjectColumns();

    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [isDeleting, setIsDeleting] = useState(false);

    const selectedProjectIds = Object.keys(rowSelection).map(Number);
    const queryParams = route().queryParams;

    const handleChangePage = (selectedPage: number) => {
        router.get(
            route('projects.index'),
            { ...queryParams, page: selectedPage },
            { onStart: () => setIsSearching(true), onFinish: () => setIsSearching(false) },
        );
    };

    const handleChangePerPage = (perPage: number) => {
        router.get(
            route('projects.index'),
            { ...queryParams, per_page: perPage, page: 1 },
            { onStart: () => setIsSearching(true), onFinish: () => setIsSearching(false) },
        );
    };

    const handleDelete: ConfirmationModalProps['onConfirm'] = ({ closeModal }) => {
        router.post(
            route('projects.bulkDelete'),
            { ids: selectedProjectIds },
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4} flexWrap="wrap">
                <ConfirmationModal
                    renderTrigger={({ openModal }) => (
                        <Button
                            color="error"
                            startIcon={<DeleteOutlinedIcon />}
                            onClick={openModal}
                            disabled={isSearching || !selectedProjectIds.length}
                        >
                            {t('delete')}
                        </Button>
                    )}
                    content={
                        <DialogContentText>
                            <Trans
                                i18nKey="deletion_confirmation"
                                count={selectedProjectIds.length}
                                values={{ count: selectedProjectIds.length }}
                                components={{
                                    warning: <Typography component="span" fontWeight={500} color="error" />,
                                }}
                            />
                        </DialogContentText>
                    }
                    onConfirm={handleDelete}
                    isLoading={isDeleting}
                />
                <Button LinkComponent={Link} href={route('projects.create')} startIcon={<AddIcon />}>
                    {t('add_new')}
                </Button>
            </Stack>
        );
    };

    const renderBottomToolbar = () => {
        return (
            <Pagination
                totalPages={projects.last_page}
                page={projects.current_page}
                onChange={handleChangePage}
                from={projects.from}
                to={projects.to}
                total={projects.total}
                perPage={projects.per_page}
                perPageOptions={perPageOptions}
                onChangePerPage={handleChangePerPage}
                disabled={isSearching}
            />
        );
    };

    return (
        <Table
            columns={columns}
            data={projects.data}
            renderTopToolbar={renderTopToolbar}
            renderBottomToolbar={!!projects.total && renderBottomToolbar}
            enableRowSelection
            positionActionsColumn="last"
            renderRowActions={({ row }) => [
                <ProjectViewModal
                    key={`view-${row.original.id}`}
                    renderTrigger={({ openModal }) => (
                        <Tooltip title={t('view')}>
                            <IconButton size="small" onClick={openModal}>
                                <VisibilityOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    projectInfo={row.original}
                    locale={locale}
                />,
                <Tooltip key={`edit-${row.original.id}`} title={t('edit')}>
                    <IconButton
                        LinkComponent={Link}
                        href={route('projects.edit', row.original.id)}
                        size="small"
                        color="info"
                    >
                        <EditOutlinedIcon />
                    </IconButton>
                </Tooltip>,
            ]}
            getRowId={(originalRow) => originalRow.id?.toString()}
            state={{ isLoading: isSearching, rowSelection }}
            onRowSelectionChange={setRowSelection}
        />
    );
};

export default ProjectTable;
