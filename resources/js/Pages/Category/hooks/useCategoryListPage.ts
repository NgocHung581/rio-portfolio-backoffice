import { useContext } from 'react';
import CategoryListPageContext from '../contexts/categoryListPageContext';

const useCategoryListPage = () => {
    const context = useContext(CategoryListPageContext);

    if (!context) {
        throw new Error('useCategoryListPage must be used within a CategoryListPageProvider');
    }
    return context;
};

export default useCategoryListPage;
