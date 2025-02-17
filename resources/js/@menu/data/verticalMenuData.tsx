import { VerticalMenuType } from '@/enums/menu';
import i18n from '@/i18n';
import { VerticalMenu } from '@/types/menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const verticalMenuData: VerticalMenu = [
    {
        type: VerticalMenuType.Link,
        href: route('dashboard', undefined, false),
        label: i18n.t('dashboard'),
        icon: HomeOutlinedIcon,
    },
];

export default verticalMenuData;
