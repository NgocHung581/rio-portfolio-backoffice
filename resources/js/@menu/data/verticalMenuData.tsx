import { VerticalMenuType } from '@/@menu/enums/menu';
import { VerticalMenu } from '@/types/menu';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
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
        href: route('projects.index', undefined, false),
        label: 'list_of_projects',
        icon: PhotoAlbumOutlinedIcon,
    },
    {
        type: VerticalMenuType.Link,
        href: route('categories.index', undefined, false),
        label: 'list_of_categories',
        icon: CategoryOutlinedIcon,
    },
    {
        type: VerticalMenuType.Link,
        href: route('behindTheScenes.index', undefined, false),
        label: 'behind_the_scenes',
        icon: MovieFilterOutlinedIcon,
    },
    {
        type: VerticalMenuType.Section,
        label: 'settings',
    },
    {
        type: VerticalMenuType.Link,
        href: route('settings.websiteContent.index', undefined, false),
        label: 'website_content',
        icon: ArticleOutlinedIcon,
    },
];

export default verticalMenuData;
