import createTheme from '@mui/material/styles/createTheme';
import overrides from './overrides';
import typography from './typography';

const theme = createTheme({
    shape: { borderRadius: 8 },
    cssVariables: {
        colorSchemeSelector: 'class',
        disableCssColorScheme: true,
    },
    colorSchemes: {
        dark: true,
        light: true,
    },
    typography,
    spacing: (factor: number) => `${0.25 * factor}rem`,
    components: overrides,
    mixins: {
        toolbar: {
            minHeight: 64,
        },
    },
});

export default theme;
