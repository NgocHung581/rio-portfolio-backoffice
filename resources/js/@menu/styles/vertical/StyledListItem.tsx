import listClasses from '@mui/material/List/listClasses';
import ListItem from '@mui/material/ListItem';
import listItemClasses from '@mui/material/ListItem/listItemClasses';
import listItemButtonClasses from '@mui/material/ListItemButton/listItemButtonClasses';
import styled from '@mui/material/styles/styled';

type Props = {
    isDeeperSubmenu?: boolean;
};

const StyledListItem = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== 'isDeeperSubmenu',
})<Props>(({ theme, isDeeperSubmenu }) => ({
    padding: 0,
    display: 'block',
    marginBottom: theme.spacing(1),
    ':last-child': {
        marginBottom: 0,
    },
    ...(isDeeperSubmenu && {
        [`.${listClasses.root} > .${listItemClasses.root} > .${listItemButtonClasses.root}`]: {
            paddingLeft: theme.spacing(6),
        },
    }),
}));

export default StyledListItem;
