import { PropsWithChildren } from '@/types';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

type ProjectListPageContextProps = {
    isSearching: boolean;
    setIsSearching: Dispatch<SetStateAction<boolean>>;
};

const ProjectListPageContext = createContext<ProjectListPageContextProps | null>(null);

export default ProjectListPageContext;

export const ProjectListPageProvider = ({ children }: PropsWithChildren) => {
    const [isSearching, setIsSearching] = useState(false);

    return (
        <ProjectListPageContext.Provider value={{ isSearching, setIsSearching }}>
            {children}
        </ProjectListPageContext.Provider>
    );
};
