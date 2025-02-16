import { Theme } from '@mui/material/styles';

const menu: Theme['components'] = {
    MuiMenu: {
        styleOverrides: {
            paper: ({ theme }) => ({
                marginTop: theme.spacing(4),
                minWidth: 160,
            }),
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
                '&.Mui-selected': {
                    backgroundColor: 'rgb(var(--mui-palette-primary-lightChannel) / 0.8)',
                    color: 'var(--mui-palette-primary-contrastText)',
                    ':hover': {
                        backgroundColor: 'var(--mui-palette-primary-light)',
                    },
                },
            }),
        },
    },
};

export default menu;
