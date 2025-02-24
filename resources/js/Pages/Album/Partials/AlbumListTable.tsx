import DebouncedInput from '@/Components/DebouncedInput';
import Pagination from '@/Components/Pagination';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlbumListPageProps } from '../List';
import useAlbumColumns from '../hooks/useAlbumColumns';

const AlbumListTable = () => {
    const { t } = useTranslation();
    const { albums, initSearchForm, errors: initErrors } = usePage<PageProps<AlbumListPageProps>>().props;
    const columns = useAlbumColumns();

    const [errors, setErrors] = useState(initErrors);
    const [isLoading, setIsLoading] = useState(false);

    const table = useMaterialReactTable({
        columns,
        data: albums.data,
        enablePagination: false,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableKeyboardShortcuts: false,
        enableBottomToolbar: !!albums.data.length,
        enableRowNumbers: true,
        positionActionsColumn: 'last',
        renderTopToolbar,
        renderBottomToolbar,
        mrtTheme: {
            baseBackgroundColor: 'rgb(var(--mui-palette-background-paperChannel))',
        },
        renderEmptyRowsFallback: () => (
            <Typography textAlign="center" color="error" py={4}>
                {t('no_data_available')}
            </Typography>
        ),
        state: { isLoading },
    });

    function renderTopToolbar() {
        return (
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={4} p={4}>
                <Box width={250}>
                    <DebouncedInput
                        initValue={initSearchForm.keyword}
                        onChange={handleSearch}
                        error={!!errors.keyword}
                        helperText={errors.keyword}
                        disabled={isLoading}
                        placeholder={`${t('search_album')}...`}
                    />
                </Box>
                <Button LinkComponent={Link} href={route('albums.create')} startIcon={<AddIcon />}>
                    {t('add')}
                </Button>
            </Stack>
        );
    }

    function renderBottomToolbar() {
        return (
            <Stack direction="row" alignContent="center" justifyContent="end" p={4}>
                <Pagination
                    total_pages={albums.meta.last_page}
                    page={albums.meta.current_page}
                    onChange={(selectedPage) => handleChangePage(selectedPage)}
                    from={albums.meta.from}
                    to={albums.meta.to}
                    total={albums.meta.total}
                />
            </Stack>
        );
    }

    function handleChangePage(selectedPage: number) {
        router.get(
            route('albums.index'),
            { page: selectedPage, keyword: initSearchForm.keyword },
            { onStart: () => setIsLoading(true), onFinish: () => setIsLoading(false) },
        );
    }

    function handleSearch(keyword: string) {
        if (keyword !== initSearchForm.keyword) {
            router.get(
                route('albums.index'),
                { keyword },
                {
                    preserveScroll: true,
                    onStart: () => {
                        setErrors({});
                        setIsLoading(true);
                    },
                    onFinish: () => setIsLoading(false),
                },
            );
        }
    }

    return <MaterialReactTable table={table} />;
};

export default AlbumListTable;
