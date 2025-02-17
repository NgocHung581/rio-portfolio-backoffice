import { VerticalMenuType } from '@/enums/menu';
import i18n from '@/i18n';
import { VerticalMenu } from '@/types/menu';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhotoAlbumOutlinedIcon from '@mui/icons-material/PhotoAlbumOutlined';

const verticalMenuData: VerticalMenu = [
    {
        type: VerticalMenuType.Link,
        href: route('dashboard', undefined, false),
        label: i18n.t('dashboard'),
        icon: HomeOutlinedIcon,
    },
    {
        type: VerticalMenuType.Section,
        label: i18n.t('data_management'),
    },
    {
        type: VerticalMenuType.Link,
        href: route('albums.index', undefined, false),
        label: i18n.t('list_of_albums'),
        icon: PhotoAlbumOutlinedIcon,
    },
    {
        type: VerticalMenuType.Section,
        label: i18n.t('setting_pages'),
    },
    {
        type: VerticalMenuType.Link,
        href: route('settingAboutPage.index', undefined, false),
        label: i18n.t('setting_about_page'),
        icon: ContactPageOutlinedIcon,
    },
];

export default verticalMenuData;
