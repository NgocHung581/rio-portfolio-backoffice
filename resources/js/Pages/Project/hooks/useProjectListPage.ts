import { useContext } from 'react';
import ProjectListPageContext from '../contexts/projectListPageContext';

const useProjectListPage = () => {
    const context = useContext(ProjectListPageContext);

    if (!context) {
        throw new Error('useProjectListPage must be used within a ProjectListPageContext.');
    }
    return context;
};

export default useProjectListPage;
