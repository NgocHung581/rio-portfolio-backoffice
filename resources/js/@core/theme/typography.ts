import { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
    fontFamily: '"Roboto", sans-serif',
    allVariants: {
        lineHeight: 1.5,
        color: 'var(--mui-palette-text-primary)',
    },
    h1: {
        fontSize: '2.25rem',
        fontWeight: 700,
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 600,
    },
    h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
    },
    h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
    },
    h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 500,
    },
};

export default typography;
