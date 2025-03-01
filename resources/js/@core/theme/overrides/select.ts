import { Theme } from '@mui/material/styles';

const select: Theme['components'] = {
    MuiSelect: {
        defaultProps: {
            MenuProps: {
                disableAutoFocusItem: true,
            },
        },
    },
};

export default select;
