import MuiPagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type Props = {
    total_pages: number;
    page: number;
    onChange: (page: number) => void;
    from: number;
    to: number;
    total: number;
};

const Pagination = ({ from, to, total, onChange, page, total_pages }: Props) => {
    const { t } = useTranslation();

    const handleChangePage = (selectedPage: number) => {
        if (selectedPage !== page) {
            onChange(selectedPage);
        }
    };

    return (
        <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="body2">{t('pagination', { from, to, total })}</Typography>
            <MuiPagination
                count={total_pages}
                page={page}
                onChange={(_, selectedPage) => handleChangePage(selectedPage)}
                variant="outlined"
                shape="rounded"
                color="primary"
                showFirstButton
                showLastButton
            />
        </Stack>
    );
};

export default Pagination;
