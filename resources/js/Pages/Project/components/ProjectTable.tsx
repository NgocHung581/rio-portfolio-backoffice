import ConfirmationModal, { ConfirmationModalProps } from '@/Components/ConfirmationModal';
import Pagination from '@/Components/Pagination';
import SelectionActionBar from '@/Components/SelectionActionBar';
import Table from '@/Components/Table';
import { Link, router, usePage } from '@inertiajs/react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { MRT_RowSelectionState } from 'material-react-table';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useProjectColumns from '../hooks/useProjectColumns';
import useProjectListPage from '../hooks/useProjectListPage';
import { ProjectListPageProps } from '../List';
import ProjectSearchForm from './ProjectSearchForm';
import ProjectViewModal from './ProjectViewModal';

const ProjectTable = () => {
    const { t } = useTranslation();
    const { projects, perPageOptions, locale } = usePage<ProjectListPageProps>().props;

    const { isSearching, setIsSearching } = useProjectListPage();
    const columns = useProjectColumns();

    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUnhighlighting, setIsUnhighlighting] = useState(false);

    // The selection belongs to the rows on screen, so it is dropped whenever another page or result set is loaded.
    useEffect(() => setRowSelection({}), [projects.data]);

    const selectedProjectIds = Object.keys(rowSelection).map(Number);
    // Only the selected projects that are highlighted can have their highlight removed.
    const highlightedProjectIds = projects.data
        .filter((project) => project.is_highlight && selectedProjectIds.includes(project.id))
        .map((project) => project.id);
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

    const handleUnhighlight: ConfirmationModalProps['onConfirm'] = ({ closeModal }) => {
        router.post(
            route('projects.bulkUnhighlight'),
            { ids: highlightedProjectIds },
            {
                onStart: () => setIsUnhighlighting(true),
                onFinish: () => setIsUnhighlighting(false),
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
            <Stack gap={3}>
                <ProjectSearchForm />
                <SelectionActionBar count={selectedProjectIds.length} onClear={() => setRowSelection({})}>
                    <ConfirmationModal
                        renderTrigger={({ openModal }) =>
                            !!highlightedProjectIds.length && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="warning"
                                    startIcon={<StarBorderIcon />}
                                    onClick={openModal}
                                    disabled={isSearching}
                                >
                                    {t('unhighlight_selected_projects', { count: highlightedProjectIds.length })}
                                </Button>
                            )
                        }
                        content={
                            <DialogContentText>
                                <Trans
                                    i18nKey="unhighlight_confirmation"
                                    count={highlightedProjectIds.length}
                                    values={{ count: highlightedProjectIds.length }}
                                />
                            </DialogContentText>
                        }
                        onConfirm={handleUnhighlight}
                        isLoading={isUnhighlighting}
                    />
                    <ConfirmationModal
                        renderTrigger={({ openModal }) =>
                            !!selectedProjectIds.length && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteOutlinedIcon />}
                                    onClick={openModal}
                                    disabled={isSearching}
                                >
                                    {t('delete_selected_projects', { count: selectedProjectIds.length })}
                                </Button>
                            )
                        }
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
                </SelectionActionBar>
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
                            <IconButton size="small" onClick={openModal} aria-label={t('preview')}>
                                <VisibilityOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    projectInfo={{ ...row.original, mediaType: row.original.category.media_type }}
                    locale={locale}
                />,
                <Tooltip key={`edit-${row.original.id}`} title={t('edit')}>
                    <IconButton
                        LinkComponent={Link}
                        href={route('projects.edit', row.original.id)}
                        size="small"
                        color="info"
                        aria-label={t('edit')}
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
