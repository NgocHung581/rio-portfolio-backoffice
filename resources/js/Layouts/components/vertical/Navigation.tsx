import Menu from '@/@menu/components/vertical/Menu';
import useVerticalNav from '@/@menu/hooks/useVericalNav';
import { VerticalNavWidth } from '@/enums/navigation';
import Drawer from '@mui/material/Drawer';
import { Fragment, UIEvent, useRef, useState } from 'react';
import StyledScrollShadow from '../styles/StyledScrollShadow';
import NavHeader from './NavHeader';

const Navigation = () => {
    const { openMobileNav, setOpenMobileNav } = useVerticalNav();

    const scrollShadowRef = useRef<HTMLDivElement>(null);

    const [isCollapsedNav, setIsCollapsedNav] = useState(false);
    const [isHoveredNav, setIsHoveredNav] = useState(false);

    const handleToggleNav = () => {
        setIsCollapsedNav(!isCollapsedNav);
        setIsHoveredNav(false);
    };

    const handleCloseMobileNav = () => {
        setOpenMobileNav(false);
    };

    const handleMouseEnterNav = () => {
        if (!isCollapsedNav) return;

        setIsHoveredNav(true);
    };

    const handleMouseLeaveNav = () => {
        if (!isCollapsedNav) return;

        setIsHoveredNav(false);
    };

    const getNavWrapperWidth = () => {
        return isCollapsedNav ? VerticalNavWidth.Collapsed : VerticalNavWidth.Opened;
    };

    const getNavInnerWidth = () => {
        if (!isCollapsedNav) return VerticalNavWidth.Opened;

        return isHoveredNav ? VerticalNavWidth.Opened : VerticalNavWidth.Collapsed;
    };

    const handleScrollMenu = (e: UIEvent<HTMLUListElement>) => {
        if (scrollShadowRef.current) {
            if (e.currentTarget.scrollTop !== 0) {
                if (!scrollShadowRef.current.classList.contains('scrolled')) {
                    {
                        scrollShadowRef.current.classList.add('scrolled');
                    }
                }
            } else {
                scrollShadowRef.current.classList.remove('scrolled');
            }
        }
    };

    const renderNavigationContent = () => {
        return (
            <Fragment>
                <NavHeader
                    isCollapsedNav={isCollapsedNav}
                    isHoveredNav={isHoveredNav}
                    onToggleNav={handleToggleNav}
                    onCloseMobileNav={handleCloseMobileNav}
                />
                <StyledScrollShadow ref={scrollShadowRef} />
                <Menu isCollapsedNav={isCollapsedNav} isHoveredNav={isHoveredNav} onScrollMenu={handleScrollMenu} />
            </Fragment>
        );
    };

    return (
        <Fragment>
            <Drawer
                variant="permanent"
                className="dark"
                open={!isCollapsedNav}
                onMouseEnter={handleMouseEnterNav}
                onMouseLeave={handleMouseLeaveNav}
                sx={(theme) => ({
                    display: { xs: 'none', lg: 'block' },
                    width: getNavWrapperWidth(),
                    transition: theme.transitions.create('width'),
                })}
                PaperProps={{
                    sx: (theme) => ({
                        width: getNavInnerWidth(),
                        position: 'sticky',
                        bgcolor: 'background.default',
                        color: 'text.secondary',
                        borderRight: 0,
                        maxHeight: '100vh',
                        boxShadow: isCollapsedNav && isHoveredNav ? 3 : 0,
                        transition: theme.transitions.create(['width', 'box-shadow']),
                    }),
                }}
            >
                {renderNavigationContent()}
            </Drawer>
            <Drawer
                variant="temporary"
                className="dark"
                open={openMobileNav}
                onClose={handleCloseMobileNav}
                sx={{ display: { lg: 'none' } }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: VerticalNavWidth.Opened,
                        bgcolor: 'background.default',
                        color: 'text.secondary',
                    },
                }}
            >
                {renderNavigationContent()}
            </Drawer>
        </Fragment>
    );
};

export default Navigation;
