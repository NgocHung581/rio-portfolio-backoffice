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
            root: ({ theme }) => [
                {
                    paddingTop: theme.spacing(2),
                    paddingBottom: theme.spacing(2),
                },
                theme.applyStyles('light', {
                    '&.Mui-selected': {
                        backgroundColor: 'var(--mui-palette-primary-darkOpacity)',
                        color: 'var(--mui-palette-primary-main)',
                        ':hover': {
                            backgroundColor: 'var(--mui-palette-primary-darkerOpacity)',
                        },
                    },
                }),
                theme.applyStyles('dark', {
                    '&.Mui-selected': {
                        backgroundColor: 'var(--mui-palette-primary-lighterOpacity)',
                        color: 'var(--mui-palette-primary-main)',
                        ':hover': {
                            backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
                        },
                    },
                }),
            ],
        },
    },
};

export default menu;
