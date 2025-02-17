import StyledListItem from '@/@menu/styles/vertical/StyledListItem';
import StyledListItemButton from '@/@menu/styles/vertical/StyledListItemButton';
import StyledListItemIcon from '@/@menu/styles/vertical/StyledListItemIcon';
import StyledListItemText from '@/@menu/styles/vertical/StyledListItemText';
import { VerticalMenuType } from '@/enums/menu';
import { VerticalSubMenu } from '@/types/menu';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import { useEffect, useState } from 'react';
import MenuItem from './MenuItem';

type Props = {
    item: VerticalSubMenu;
    isCollapsedNav: boolean;
    isHoveredNav: boolean;
    isDeeperSubmenu?: boolean;
    onClickNavLink?: () => void;
};

const SubMenu = ({ item, isCollapsedNav, isHoveredNav, isDeeperSubmenu, onClickNavLink }: Props) => {
    const [isOpenSubmenu, setIsOpenSubmenu] = useState(false);
    const [isActiveSubmenu, setIsActiveSubmenu] = useState(false);

    const currentHref = window.location.pathname;

    useEffect(() => {
        function getActiveSubmenu(items: VerticalSubMenu['items']) {
            for (const item of items) {
                if (item.type === VerticalMenuType.Submenu) {
                    if (getActiveSubmenu(item.items)) {
                        return true;
                    }
                }

                if (item.type === VerticalMenuType.Link && item.href === currentHref) {
                    return true;
                }
            }

            return false;
        }

        const isActive = getActiveSubmenu(item.items);

        setIsOpenSubmenu(isActive);
        setIsActiveSubmenu(isActive);
    }, [currentHref]);

    const renderIcon = () => {
        let Icon = item.icon;

        if (isDeeperSubmenu) {
            if (!Icon) {
                Icon = CircleIcon;
            }

            return <Icon sx={{ fontSize: 8, ml: 2, mr: 2 }} />;
        }

        if (Icon) return <Icon />;

        return null;
    };

    return (
        <StyledListItem isDeeperSubmenu={isDeeperSubmenu}>
            <StyledListItemButton
                isSubmenu
                onClick={() => setIsOpenSubmenu((prev) => !prev)}
                selected={isActiveSubmenu}
            >
                <StyledListItemIcon isCollapsedNav={isCollapsedNav} isHoveredNav={isHoveredNav}>
                    {renderIcon()}
                </StyledListItemIcon>

                <StyledListItemText
                    isCollapsedNav={isCollapsedNav}
                    isHoveredNav={isHoveredNav}
                    primary={item.label}
                    slotProps={{ primary: { noWrap: true } }}
                />

                {(!isCollapsedNav || (isCollapsedNav && isHoveredNav)) && (
                    <KeyboardArrowRightIcon
                        sx={{
                            transform: isOpenSubmenu ? 'rotate(90deg)' : 'rotate(0)',
                            transition: (theme) => theme.transitions.create('transform'),
                        }}
                    />
                )}
            </StyledListItemButton>

            <Collapse in={isOpenSubmenu} timeout="auto">
                {item.items.length !== 0 && (
                    <List
                        sx={{
                            display: !isCollapsedNav || (isCollapsedNav && isHoveredNav) ? 'block' : 'none',
                            py: 0,
                            mt: 1,
                        }}
                    >
                        {item.items.map((subitem, index) => (
                            <MenuItem
                                key={index}
                                item={subitem}
                                isCollapsedNav={isCollapsedNav}
                                isHoveredNav={isHoveredNav}
                                isDeeperSubmenu={subitem.type === VerticalMenuType.Submenu}
                                onClickNavLink={onClickNavLink}
                            />
                        ))}
                    </List>
                )}
            </Collapse>
        </StyledListItem>
    );
};

export default SubMenu;
