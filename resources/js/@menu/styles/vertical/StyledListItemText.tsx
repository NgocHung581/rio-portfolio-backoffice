import ListItemText from '@mui/material/ListItemText';
import listItemTextClasses from '@mui/material/ListItemText/listItemTextClasses';
import styled from '@mui/material/styles/styled';

type Props = {
    isCollapsedNav: boolean;
    isHoveredNav: boolean;
};

const StyledListItemText = styled(ListItemText, {
    shouldForwardProp: (prop) => !['isCollapsedNav', 'isHoveredNav'].includes(prop.toString()),
})<Props>(({ theme, isCollapsedNav, isHoveredNav }) => ({
    flex: 1,
    [`${theme.breakpoints.up('lg')}`]: {
        flex: !isCollapsedNav || (isCollapsedNav && isHoveredNav) ? 1 : 0,
        opacity: !isCollapsedNav || (isCollapsedNav && isHoveredNav) ? 1 : 0,
    },
    [`.${listItemTextClasses.primary}`]: {
        color: 'inherit',
        fontWeight: 'inherit',
        transition: theme.transitions.create('opacity'),
    },
}));

export default StyledListItemText;
