import { saveJsonFile } from '@/components/methods';
import * as RNFS from '@dr.pogodin/react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from "@react-native-community/netinfo";
import { createClient, processLock } from '@supabase/supabase-js';
import { useQueries } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


interface QuoteContextType {
    charQuery: (name: string) => void;
    jsonData: any;
    charJson: any;
    isLoading: boolean;
    isCharLoading: boolean;
    dailyQuote: any;
    updateDailyQuote: any;
    isOnline: any;
    dbOnline: any;
}

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? '';
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? '';

const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
})

const filePath = `${RNFS.DocumentDirectoryPath}/quotes.json`;
const charFilePath = `${RNFS.DocumentDirectoryPath}/characters.json`;

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children } : {children: ReactNode}) => {

    const router = useRouter();

    const charQuery = async (name: string) => {
        router.push(`/query/${name}`)        
    }


    const [isOnline, setIsOnline] = useState(false);
    const [dbOnline, setDBOnline] = useState(false);

    const [ jsonData, setJsonData ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const [ charJson, setCharJson ] = useState([]);
    const [ isCharLoading, setIsCharLoading ] = useState(true); 

    const [dailyQuote, setDailyQuote] = useState({});

    
    const checkDBStatus = async () => {
        const { data, error } = await supabase.from('quotes').select('*').limit(1);

            if(error) {
                console.log("Error connecting to supabase: ", error);
                return false;
            }

        return true;
    }

    useEffect(() => {
        fetch().then(state => {
            if(state.isConnected) {
                setIsOnline(false);
            }
        });

        let dbStatus = checkDBStatus();

        dbStatus.then((res) => {
        if(res){
            setDBOnline(true);
        }
        }).catch((error) => {
            console.log(error);
            setDBOnline(false);
        })

    },[]);

    const getQuotes = async () => {
    
        let json;

        if(isOnline) {
            const { data, error } = await supabase.rpc('get_quotes_json');

            if (error) throw error;

            json = JSON.stringify(data, null, 2);

            if(data) {
                saveJsonFile('quotes.json',json);
            }

            return data;
            
        } 

        // Offline Pathway
        try {
            const exists = await RNFS.exists(filePath);

            if (exists) {
                const content = await RNFS.readFile(filePath, 'utf8');
                const jsonObject = JSON.parse(content);

                if (jsonObject) {
                    return jsonObject; 
                }
            }
        } catch (error) {
            console.error("Error reading offline backup file:", error);
        }
    
        return [];
    }

    const getChars = async () => {
        let json;

        if(isOnline) {
            const { data , error } = await supabase.from('characters').select('*')

            if (error) throw error;

            json = JSON.stringify(data, null, 2);

            if(data) {
                saveJsonFile('characters.json',json);
            }

            return data;
            
        } 

        // Offline Pathway
        try {
            const exists = await RNFS.exists(charFilePath);

            if (exists) {
                const content = await RNFS.readFile(charFilePath, 'utf8');
                const jsonObject = JSON.parse(content);

                if (jsonObject) {
                    return jsonObject; 
                }
            }
        } catch (error) {
            console.error("Error reading offline backup file:", error);
        }
    
        return [];
    }

    const [quotesQuery, charsQuery] = useQueries({
        queries: [
            {queryKey: ['quoteData'], queryFn: getQuotes},
            {queryKey: ['charData'], queryFn: getChars}
        ]
    })
    
    useEffect(() => {
        if (quotesQuery.data && charsQuery.data) {
            setIsLoading(false);
            setJsonData(quotesQuery.data);
            setCharJson(charsQuery.data);
        }
    }, [quotesQuery.data, charsQuery.data]);
    

    


    const updateDailyQuote = (x: any) => {
        setDailyQuote((prev: any) => {
            return x
        });
    };

   
    return (
        <QuoteContext.Provider value={{ charQuery, jsonData, isLoading, charJson, isCharLoading, dailyQuote, updateDailyQuote, isOnline, dbOnline }}>
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

