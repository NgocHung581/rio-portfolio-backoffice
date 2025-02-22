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
                color: theme.palette.text.secondary,
            }),
            asterisk: {
                color: 'red',
            },
        },
    },
    MuiFormControl: {
        defaultProps: {
            fullWidth: true,
        },
    },
    MuiFormHelperText: {
        styleOverrides: {
            root: ({ theme }) => ({
                margin: theme.spacing(1, 3.5, 0),
            }),
        },
    },
};

export default input;
