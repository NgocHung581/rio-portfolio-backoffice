import { PropsWithChildren } from '@/types';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

type VerticalNavContextProps = {
    openMobileNav: boolean;
    setOpenMobileNav: Dispatch<SetStateAction<boolean>>;
};

const VerticalNavContext = createContext<VerticalNavContextProps | null>(null);

export default VerticalNavContext;

export const VerticalNavProvider = ({ children }: PropsWithChildren) => {
    const [openMobileNav, setOpenMobileNav] = useState(false);

    return (
        <VerticalNavContext.Provider value={{ openMobileNav, setOpenMobileNav }}>
            {children}
        </VerticalNavContext.Provider>
    );
};
