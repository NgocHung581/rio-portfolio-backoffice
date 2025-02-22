import StyledListItem from '@/@menu/styles/vertical/StyledListItem';
import { VerticalMenuSection } from '@/types/menu';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';

type Props = {
    item: VerticalMenuSection;
    isCollapsedNav: boolean;
    isHoveredNav: boolean;
};

const MenuSection = ({ item, isCollapsedNav, isHoveredNav }: Props) => {
    const { t } = useTranslation();

    return (
        <StyledListItem sx={{ mt: 7, mb: 2, py: !!item.label ? 1.375 : 3.875 }}>
            <Divider textAlign="left" sx={{ width: 1, fontSize: 14, textTransform: 'uppercase' }}>
                {(!isCollapsedNav || (isCollapsedNav && isHoveredNav)) && t(item.label ?? '')}
            </Divider>
        </StyledListItem>
    );
};

export default MenuSection;
