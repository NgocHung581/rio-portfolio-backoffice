import { Theme } from '@mui/material/styles';

const card: Theme['components'] = {
    MuiCardActions: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(4),
            }),
        },
    },
};

export default card;
