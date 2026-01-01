import { Theme } from '@mui/material/styles';

const form: Theme['components'] = {
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
    MuiSelect: {
        defaultProps: {
            size: 'small',
        },
    },
};

export default form;
