import { Theme } from '@mui/material/styles';

const list: Theme['components'] = {
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                minWidth: 0,
            },
        },
    },
    MuiListItemText: {
        styleOverrides: {
            root: {
                marginTop: 0,
                marginBottom: 0,
            },
        },
    },
};

export default list;
