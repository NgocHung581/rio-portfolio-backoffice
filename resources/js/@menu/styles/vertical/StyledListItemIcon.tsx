import ListItemIcon, { ListItemIconProps } from '@mui/material/ListItemIcon';
import styled from '@mui/material/styles/styled';

type Props = ListItemIconProps & {
    isCollapsedNav: boolean;
    isHoveredNav: boolean;
};

const StyledListItemIcon = styled(ListItemIcon, {
    shouldForwardProp: (prop) => !['isCollapsedNav', 'isHoveredNav'].includes(prop.toString()),
})<Props>(({ theme, isCollapsedNav, isHoveredNav }) => ({
    color: 'inherit',
    transition: theme.transitions.create('margin'),
    marginRight: theme.spacing(2),
    [`${theme.breakpoints.up('lg')}`]: {
        marginRight: !isCollapsedNav || (isCollapsedNav && isHoveredNav) ? theme.spacing(2) : 0,
    },
}));

export default StyledListItemIcon;
