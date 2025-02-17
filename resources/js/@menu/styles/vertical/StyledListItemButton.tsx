import { InertiaLinkProps } from '@inertiajs/react';
import ListItemButton from '@mui/material/ListItemButton';
import styled from '@mui/material/styles/styled';

type Props = Partial<InertiaLinkProps> & {
    isSubmenu?: boolean;
};

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'isSubmenu',
})<Props>(({ theme, isSubmenu }) => ({
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    fontWeight: 500,
    transition: theme.transitions.create(['background-color', 'color']),
    ':hover': { backgroundColor: 'var(--mui-palette-action-hover)' },
    '&.Mui-selected': {
        backgroundColor: isSubmenu ? 'var(--mui-palette-action-hover)' : 'var(--mui-palette-primary-main)',
        color: isSubmenu ? 'var(--mui-palette-text-primary)' : 'var(--mui-palette-primary-contrastText)',
        ':hover': {
            backgroundColor: isSubmenu ? 'var(--mui-palette-action-hover)' : 'var(--mui-palette-primary-main)',
        },
    },
}));

export default StyledListItemButton;
