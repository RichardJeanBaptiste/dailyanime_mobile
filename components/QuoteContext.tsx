import * as RNFS from '@dr.pogodin/react-native-fs';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface QuoteContextType {
    charQuery: (name: string) => void;
    jsonData: any;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children } : {children: ReactNode}) => {

    const router = useRouter();

    const charQuery = async (name: string) => {
        router.push(`/query/${name}`)        
    }

    const [ jsonData, setJsonData ] = useState([]);

    const loadJsonFile = async () => {
        const filePath = `${RNFS.DocumentDirectoryPath}/user_data.json`;
        try {
            const exists = await RNFS.exists(filePath);
            
            if (exists) {
                // 2. Read the file as a string
                const content = await RNFS.readFile(filePath, 'utf8');
                
                const jsonObject = JSON.parse(JSON.parse(content));

                setJsonData(jsonObject);

                console.log('Data loaded successfully');
            } else {
                console.log('No saved file found');
            }
        } catch (error) {
            console.error('Error reading file:', error);
        }
    };

    useEffect(() => {
        loadJsonFile();
    },[]);

   
    return (
        <QuoteContext.Provider value={{ charQuery, jsonData }}>
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
