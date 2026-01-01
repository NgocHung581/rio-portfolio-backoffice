import createTheme from '@mui/material/styles/createTheme';
import overrides from './overrides';
import typography from './typography';
import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes';

const theme = createTheme({
    shape: { borderRadius: 8 },
    cssVariables: true,
    typography,
    spacing: (factor: number) => `${0.25 * factor}rem`,
    components: overrides,
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },
    transitions: {
        duration: {
            standard: 150,
        },
    },
});

export default responsiveFontSizes(theme);
