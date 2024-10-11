import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface AppContextType {
    mailingGroupId: string;
    setMailingGroupId: (id: string) => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to access the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

// Create the provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [mailingGroupId, setMailingGroupId] = useState<string>(''); // Default mailingGroupId

    return (
        <AppContext.Provider value={{ mailingGroupId, setMailingGroupId }}>
            {children}
        </AppContext.Provider>
    );
};
