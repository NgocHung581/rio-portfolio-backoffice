import createTheme from '@mui/material/styles/createTheme';
import overrides from './overrides';
import typography from './typography';

const theme = createTheme({
    shape: { borderRadius: 8 },
    cssVariables: { colorSchemeSelector: 'class' },
    typography,
    spacing: (factor: number) => `${0.25 * factor}rem`,
    components: overrides,
});

export default theme;
