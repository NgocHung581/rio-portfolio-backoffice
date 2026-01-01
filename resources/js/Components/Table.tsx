import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
    MaterialReactTable,
    MRT_Cell,
    MRT_Row,
    MRT_TableInstance,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_RowData,
    type MRT_TableOptions,
} from 'material-react-table';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_VI } from 'material-react-table/locales/vi';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type RenderRowActionsProps<TData extends MRT_RowData> = {
    cell: MRT_Cell<TData>;
    row: MRT_Row<TData>;
    staticRowIndex?: number;
    table: MRT_TableInstance<TData>;
};

type Props<TData extends MRT_RowData> = Omit<
    MRT_TableOptions<TData>,
    | 'columns'
    | 'data'
    | 'enablePagination'
    | 'enableSorting'
    | 'enableColumnActions'
    | 'enableColumnFilters'
    | 'enableKeyboardShortcuts'
    | 'enableRowNumbers'
    | 'renderEmptyRowsFallback'
    | 'enableTopToolbar'
    | 'enableBottomToolbar'
    | 'renderRowActionMenuItems'
    | 'enableRowActions'
    | 'renderRowActions'
    | 'layoutMode'
> & {
    columns: MRT_ColumnDef<TData>[];
    data: TData[];
    renderRowActions?: (props: RenderRowActionsProps<TData>) => ReactNode[];
};

const Table = <TData extends MRT_RowData>({
    columns,
    data,
    renderTopToolbar,
    renderBottomToolbar,
    renderRowActions,
    ...rest
}: Props<TData>) => {
    const { t, i18n } = useTranslation();

    const table = useMaterialReactTable({
        ...rest,
        layoutMode: 'grid',
        localization: i18n.language === 'vi' ? MRT_Localization_VI : MRT_Localization_EN,
        columns,
        data,
        enablePagination: false,
        enableSorting: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableKeyboardShortcuts: false,
        enableRowNumbers: true,
        enableTopToolbar: !!renderTopToolbar,
        enableBottomToolbar: !!renderBottomToolbar,
        enableRowActions: !!renderRowActions,
        renderTopToolbar: (renderTopToolbarProps) => (
            <Box p={4}>
                {typeof renderTopToolbar === 'function' ? renderTopToolbar(renderTopToolbarProps) : renderTopToolbar}
            </Box>
        ),
        renderBottomToolbar: (renderBottomToolbarProps) => (
            <Box p={4}>
                {typeof renderBottomToolbar === 'function'
                    ? renderBottomToolbar(renderBottomToolbarProps)
                    : renderBottomToolbar}
            </Box>
        ),
        renderRowActions: (props) =>
            !!renderRowActions && (
                <Stack direction="row" alignItems="center">
                    {renderRowActions(props)}
                </Stack>
            ),
        displayColumnDefOptions: {
            'mrt-row-numbers': {
                muiTableHeadCellProps: {
                    align: 'center',
                    sx: { pb: 3 },
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            'mrt-row-select': {
                muiTableHeadCellProps: {
                    align: 'center',
                    sx: { pb: 3 },
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
        },
        renderEmptyRowsFallback: () => (
            <Typography textAlign="center" color="error" py={4}>
                {t('no_data_available')}
            </Typography>
        ),
        state: { showLoadingOverlay: false, ...rest.state },
        muiTableBodyRowProps: {
            sx: {
                '&.Mui-selected td::after': {
                    bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
                },
                '&.Mui-selected:hover td::after': {
                    bgcolor:
                        'rgba(var(--mui-palette-primary-mainChannel) / calc(var(--mui-palette-action-selectedOpacity) + var(--mui-palette-action-hoverOpacity)))',
                },
            },
        },
    });

    return <MaterialReactTable table={table} />;
};

export default Table;
