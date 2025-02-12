import { Theme } from '@mui/material/styles';

const input: Theme['components'] = {
    MuiTextField: {
        defaultProps: {
            size: 'small',
            fullWidth: true,
        },
    },
    MuiFormLabel: {
        styleOverrides: {
            root: ({ theme }) => ({
                fontWeight: 500,
                marginBottom: theme.spacing(1),
                color: theme.palette.text.primary,
            }),
        },
    },
};

export default input;
