import { Theme } from '@mui/material/styles';

const button: Theme['components'] = {
    MuiButton: {
        defaultProps: {
            variant: 'contained',
        },
        styleOverrides: {
            root: {
                textTransform: 'none',
            },
            sizeSmall: ({ theme }) => ({
                padding: theme.spacing(1.5, 4),
                fontSize: 14,
                lineHeight: 1.715,
            }),
            sizeMedium: ({ theme }) => ({
                padding: theme.spacing(2, 5.5),
                lineHeight: 1.6,
                fontSize: 15,
            }),
            sizeLarge: ({ theme }) => ({
                padding: theme.spacing(2.5, 6.5),
                fontSize: 16,
            }),
        },
    },
};

export default button;
