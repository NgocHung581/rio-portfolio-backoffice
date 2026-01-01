import { PropsWithChildren } from '@/types';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

type CategoryListPageContextProps = {
    isSearching: boolean;
    setIsSearching: Dispatch<SetStateAction<boolean>>;
};

const CategoryListPageContext = createContext<CategoryListPageContextProps | null>(null);

export default CategoryListPageContext;

export const CategoryListPageProvider = ({ children }: PropsWithChildren) => {
    const [isSearching, setIsSearching] = useState(false);

    return (
        <CategoryListPageContext.Provider value={{ isSearching, setIsSearching }}>
            {children}
        </CategoryListPageContext.Provider>
    );
};
