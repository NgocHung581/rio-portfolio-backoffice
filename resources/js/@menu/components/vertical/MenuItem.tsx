import { VerticalMenuType } from '@/enums/menu';
import { VerticalMenuItem } from '@/types/menu';
import MenuItemLink from './MenuItemLink';
import MenuSection from './MenuSection';
import SubMenu from './SubMenu';

type Props = {
    item: VerticalMenuItem;
    isCollapsedNav: boolean;
    isHoveredNav: boolean;
    isDeeperSubmenu?: boolean;
    onClickNavLink?: () => void;
};

const MenuItem = ({ item, ...props }: Props) => {
    if (item.type === VerticalMenuType.Section) {
        return <MenuSection item={item} {...props} />;
    }

    if (item.type === VerticalMenuType.Submenu) {
        return <SubMenu item={item} {...props} />;
    }

    if (item.type === VerticalMenuType.Link) {
        return <MenuItemLink item={item} onClick={props.onClickNavLink} {...props} />;
    }

    return null;
};

export default MenuItem;
