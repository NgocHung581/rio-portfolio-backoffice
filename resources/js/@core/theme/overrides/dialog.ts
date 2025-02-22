import { Theme } from '@mui/material/styles';

const dialog: Theme['components'] = {
    MuiDialogActions: {
        styleOverrides: {
            root: ({ theme }) => ({
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
            }),
        },
    },
};

export default dialog;
