import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext } from "react";

interface QuoteContextType {
    charQuery: (name: string) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children } : {children: ReactNode}) => {

    const router = useRouter();

    const charQuery = async (name: string) => {
        router.push(`/query/${name}`)        
    }

   
    return (
        <QuoteContext.Provider value={{ charQuery }}>
            {children}
        </QuoteContext.Provider>
    )
}

export const useSearchContext = () => {
    const context = useContext(QuoteContext);

    if (!context) {
        throw new Error('useSearchContext must be used within a UserProvider');
    }
    
    return context;
}
