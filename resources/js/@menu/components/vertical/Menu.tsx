import verticalMenuData from '@/@menu/data/verticalMenuData';
import List from '@mui/material/List';
import styled from '@mui/material/styles/styled';
import { UIEvent } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import MenuItem from './MenuItem';

type Props = {
    isCollapsedNav: boolean;
    isHoveredNav: boolean;
    onScrollMenu: (e: UIEvent<HTMLUListElement>) => void;
};

const StyledPerfectScrollbar = styled(PerfectScrollbar)(({ theme }) => ({
    flex: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
}));

const Menu = ({ isCollapsedNav, isHoveredNav, onScrollMenu }: Props) => {
    return (
        <StyledPerfectScrollbar onScroll={onScrollMenu}>
            <List>
                {verticalMenuData.map((item, index) => (
                    <MenuItem key={index} item={item} isCollapsedNav={isCollapsedNav} isHoveredNav={isHoveredNav} />
                ))}
            </List>
        </StyledPerfectScrollbar>
    );
};

export default Menu;
