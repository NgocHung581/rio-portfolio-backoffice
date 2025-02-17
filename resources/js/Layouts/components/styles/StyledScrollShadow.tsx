import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';

const StyledScrollShadow = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 60,
    width: '100%',
    zIndex: 3,
    height: theme.mixins.toolbar.minHeight,
    pointerEvents: 'none',
    opacity: 0,
    transition: theme.transitions.create('opacity'),
    background:
        'linear-gradient(var(--mui-palette-background-default) 5%, rgb(var(--mui-palette-background-defaultChannel) / 0.85) 30%, rgb(var(--mui-palette-background-defaultChannel) / 0.5) 65%, rgb(var(--mui-palette-background-defaultChannel) / 0.3) 75%, transparent)',
    '&.scrolled': {
        opacity: 1,
    },
}));

export default StyledScrollShadow;
