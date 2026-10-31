import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    /** The number of selected rows. The bar is hidden while it is zero. */
    count: number;
    onClear: () => void;
    /** Actions that apply to the selected rows. */
    children: ReactNode;
};

/**
 * A bar below the filters of a table, shown only while rows are selected. It keeps the actions on the selected rows
 * apart from the filters, and says how many rows they apply to.
 */
const SelectionActionBar = ({ count, onClear, children }: Props) => {
    const { t } = useTranslation();

    if (!count) return null;

    return (
        <Stack
            role="region"
            aria-label={t('selected_count', { count })}
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            gap={2}
            px={3}
            py={2}
            border={1}
            borderColor="divider"
            borderRadius={1}
            sx={(theme) => ({ bgcolor: alpha(theme.palette.primary.main, 0.05) })}
        >
            <Stack direction="row" alignItems="center" gap={2}>
                <Typography variant="body2" fontWeight={500}>
                    {t('selected_count', { count })}
                </Typography>
                <Button variant="text" size="small" onClick={onClear}>
                    {t('clear_selection')}
                </Button>
            </Stack>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                gap={2}
                sx={{ '& .MuiButton-root': { width: { xs: 1, sm: 'auto' } } }}
            >
                {children}
            </Stack>
        </Stack>
    );
};

export default SelectionActionBar;
