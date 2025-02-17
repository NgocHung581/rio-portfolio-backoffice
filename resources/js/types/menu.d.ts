import { VerticalMenuType } from '@/enums/menu';
import { SvgIconComponent } from '@mui/icons-material';

export type VerticalMenuItemLink = {
    type: VerticalMenuType.Link;
    href: string;
    label: string;
    icon?: SvgIconComponent;
    isExternalLink?: boolean;
};

export type VerticalSubMenu = {
    type: VerticalMenuType.Submenu;
    label: string;
    items: (VerticalMenuItem | VerticalSubMenu)[];
    icon?: SvgIconComponent;
};

export type VerticalMenuSection = {
    type: VerticalMenuType.Section;
    label?: string;
};

export type VerticalMenuItem = VerticalMenuItemLink | VerticalSubMenu | VerticalMenuSection;

export type VerticalMenu = VerticalMenuItem[];
