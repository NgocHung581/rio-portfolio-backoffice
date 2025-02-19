import { Theme } from '@mui/material/styles';

const tooltip: Theme['components'] = {
    MuiTooltip: {
        defaultProps: {
            arrow: true,
            disableInteractive: true,
        },
    },
};

export default tooltip;
