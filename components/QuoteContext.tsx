import * as RNFS from '@dr.pogodin/react-native-fs';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface QuoteContextType {
    charQuery: (name: string) => void;
    jsonData: any;
    charJson: any;
    isLoading: boolean;
    isCharLoading: boolean;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children } : {children: ReactNode}) => {

    const router = useRouter();

    const charQuery = async (name: string) => {
        router.push(`/query/${name}`)        
    }

    const [ jsonData, setJsonData ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);


    const [ charJson, setCharJson ] = useState([]);
    const [ isCharLoading, setIsCharLoading ] = useState(true); 


    const loadJsonFile = async () => {
        const filePath = `${RNFS.DocumentDirectoryPath}/user_data.json`;
        try {
            const exists = await RNFS.exists(filePath);
            
            if (exists) {
                const content = await RNFS.readFile(filePath, 'utf8');
                const jsonObject = JSON.parse(content);

                if(jsonObject == null || jsonObject == undefined) {
                    console.log("Json is null");
                    return;
                }

                let randomIndex;

                if(jsonObject) {
                    randomIndex = Math.floor(Math.random() * jsonObject.length);
                } else {
                    randomIndex = Math.floor(Math.random() * 100);
                }

                setJsonData(jsonObject);

                let x = {
                    char_name: jsonObject[randomIndex].char_name ,
                    anime: jsonObject[randomIndex].anime || '',
                    img_links: jsonObject[randomIndex].img_links || [],
                    quote: jsonObject[randomIndex].quote || '',
                    biography: jsonObject[randomIndex].biography || '',
                    wiki: jsonObject[randomIndex].wiki || ''
                }
            }
        } catch (error) {
            console.error('Error reading file:', error);
        } finally {
            setIsLoading(false); 
        }
    };

    const loadCharJson = async () => {
        const filepath = `${RNFS.DocumentDirectoryPath}/characters.json`;

        try {
            const exists = await RNFS.exists(filepath);
            if(exists) {
                const content = await RNFS.readFile(filepath, 'utf8');
                const jsonObject = JSON.parse(content);

                console.log("Character Json: ", charJson);
                setCharJson(jsonObject);
            }
        } catch (error) {
            console.error('Error reading characters.json', error);
        } finally {
            setIsCharLoading(false);
        }
    };

    useEffect(() => {
        loadJsonFile();
        loadCharJson();
    },[]);

   
    return (
        <QuoteContext.Provider value={{ charQuery, jsonData, isLoading, charJson, isCharLoading }}>
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
