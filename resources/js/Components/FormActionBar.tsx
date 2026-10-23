import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    hasErrors?: boolean;
    /** Actions on the left, e.g. a cancel button. */
    start?: ReactNode;
    /** Actions on the right, with the main action last. */
    children: ReactNode;
};

/**
 * A floating bar at the bottom of a form that keeps its actions in reach while scrolling through long content.
 */
const FormActionBar = ({ hasErrors, start, children }: Props) => {
    const { t } = useTranslation();

    return (
        <Paper
            elevation={6}
            sx={{
                position: 'sticky',
                bottom: (theme) => theme.spacing(4),
                zIndex: 'appBar',
                mt: 6,
                px: { xs: 3, sm: 4 },
                py: 3,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            {start}
            <Box flex={1} />
            {hasErrors && (
                <Stack direction="row" alignItems="center" gap={1.5} role="alert" color="error.main" mr={2}>
                    <ErrorOutlineIcon fontSize="small" />
                    <Typography variant="body2" color="error">
                        {t('messages.form_has_errors')}
                    </Typography>
                </Stack>
            )}
            {children}
        </Paper>
    );
};

export default FormActionBar;
