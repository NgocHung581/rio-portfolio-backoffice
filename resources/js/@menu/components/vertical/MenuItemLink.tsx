import StyledListItem from '@/@menu/styles/vertical/StyledListItem';
import StyledListItemButton from '@/@menu/styles/vertical/StyledListItemButton';
import StyledListItemIcon from '@/@menu/styles/vertical/StyledListItemIcon';
import StyledListItemText from '@/@menu/styles/vertical/StyledListItemText';
import { VerticalMenuItemLink } from '@/types/menu';
import { Link } from '@inertiajs/react';
import CircleIcon from '@mui/icons-material/Circle';
import { MouseEvent } from 'react';

type Props = {
    item: VerticalMenuItemLink;
    isCollapsedNav: boolean;
    isHoveredNav: boolean;
    isDeeperSubmenu?: boolean;
    onClick?: () => void;
};

const MenuItemLink = ({
    item: { icon: Icon, ...item },
    isCollapsedNav,
    isHoveredNav,
    isDeeperSubmenu,
    onClick,
}: Props) => {
    const isActiveHref = item.href === window.location.pathname;

    const handleClickItem = (e: MouseEvent<Element>) => {
        if (isActiveHref && !window.location.search) {
            e.preventDefault();
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }

        onClick && onClick();
    };

    return (
        <StyledListItem isDeeperSubmenu={isDeeperSubmenu}>
            <StyledListItemButton
                LinkComponent={Link}
                href={item.href}
                onClick={handleClickItem}
                selected={isActiveHref}
            >
                <StyledListItemIcon isCollapsedNav={isCollapsedNav} isHoveredNav={isHoveredNav}>
                    {Icon ? <Icon /> : <CircleIcon sx={{ fontSize: 8, ml: 2, mr: 2 }} />}
                </StyledListItemIcon>
                <StyledListItemText
                    isCollapsedNav={isCollapsedNav}
                    isHoveredNav={isHoveredNav}
                    primary={item.label}
                    slotProps={{ primary: { noWrap: true } }}
                />
            </StyledListItemButton>
        </StyledListItem>
    );
};

export default MenuItemLink;
