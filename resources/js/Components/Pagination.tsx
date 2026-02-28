import { Option } from '@/types';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import MuiPagination from '@mui/material/Pagination';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type Props = {
    totalPages: number;
    page: number;
    onChange: (page: number) => void;
    from: number;
    to: number;
    total: number;
    perPage: number;
    perPageOptions: Option[];
    onChangePerPage: (perPage: number) => void;
    disabled?: boolean;
};

const Pagination = ({
    from,
    to,
    total,
    onChange,
    page,
    totalPages,
    perPage,
    perPageOptions,
    onChangePerPage,
    disabled,
}: Props) => {
    const { t } = useTranslation();

    const handleChangePage = (selectedPage: number) => {
        if (selectedPage === page) return;

        onChange(selectedPage);
    };

    const handleChangePerPage = (event: SelectChangeEvent) => {
        if (Number(event.target.value) === perPage) return;

        onChangePerPage(Number(event.target.value));
    };

    return (
        <Stack width={1} direction="row" alignItems="center" justifyContent="space-between" gap={4} flexWrap="wrap">
            <Stack
                direction="row"
                alignItems="center"
                gap={4}
                divider={<Divider orientation="vertical" flexItem sx={{ my: 2 }} />}
            >
                <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                    <Typography variant="body2">{t('show_per_page')}</Typography>
                    <Select
                        value={perPage.toString()}
                        onChange={handleChangePerPage}
                        disabled={disabled}
                        fullWidth={false}
                    >
                        {perPageOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
                <Typography variant="body2">{t('pagination', { from, to, total })}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
                <MuiPagination
                    count={totalPages}
                    page={page}
                    onChange={(_, selectedPage) => handleChangePage(selectedPage)}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    showFirstButton
                    showLastButton
                    disabled={disabled}
                />
            </Stack>
        </Stack>
    );
};

export default Pagination;
