import { Theme } from '@mui/material/styles';

const menu: Theme['components'] = {
    MuiMenu: {
        styleOverrides: {
            paper: ({ theme }) => ({
                marginTop: theme.spacing(2),
                minWidth: 160,
            }),
        },
        defaultProps: {
            disableEnforceFocus: true,
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: ({ theme }) => [
                {
                    paddingTop: theme.spacing(2),
                    paddingBottom: theme.spacing(2),
                },
            ],
        },
    },
};

export default menu;
