import { VerticalMenuType } from '@/enums/menu';
import { VerticalMenu } from '@/types/menu';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhotoAlbumOutlinedIcon from '@mui/icons-material/PhotoAlbumOutlined';

const verticalMenuData: VerticalMenu = [
    {
        type: VerticalMenuType.Link,
        href: route('dashboard', undefined, false),
        label: 'dashboard',
        icon: HomeOutlinedIcon,
    },
    {
        type: VerticalMenuType.Section,
        label: 'data_management',
    },
    {
        type: VerticalMenuType.Link,
        href: route('albums.index', undefined, false),
        label: 'list_of_albums',
        icon: PhotoAlbumOutlinedIcon,
    },
    {
        type: VerticalMenuType.Section,
        label: 'setting_pages',
    },
    {
        type: VerticalMenuType.Link,
        href: route('settingAboutPage.index', undefined, false),
        label: 'setting_about_page',
        icon: ContactPageOutlinedIcon,
    },
];

export default verticalMenuData;
