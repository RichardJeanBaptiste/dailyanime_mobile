import * as RNFS from '@dr.pogodin/react-native-fs';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import uuid from 'react-native-uuid';

interface QuoteContextType {
    charQuery: (name: string) => void;
    jsonData: any;
    charJson: any;
    isLoading: boolean;
    isCharLoading: boolean;
    subQuote: any;
    subIndex: number;
    isSubClicked: boolean;
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

    const [ subQuote , setSubQuote] = useState<any>({
        char_name : '',
        anime: '',
        img_links: '',
        quote: '',
        biography: '', 
        wiki: '',
       id: uuid.v4()
    });

    const [ subIndex, setSubIndex] = useState<number>(0);

    const [ isSubClicked, setIsSubClicked] = useState<boolean>(false);




    useEffect(() => {

        if (!subQuote?.quote) return;

        const setupNotifications = async () => {
            try {
                await Notifications.cancelAllScheduledNotificationsAsync();

                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: subQuote.char_name,
                        body: subQuote.quote,
                        data: { quoteId: subQuote.id },
                    },
                    trigger: {
                        hour: 11,
                        minute: 21,
                        repeats: true,
                        channelId: 'daily-quotes',
                    } as Notifications.NotificationTriggerInput,
                });

                //console.log("Scheduled with quote:", subQuote.quote);
            } catch (err) {
                console.log("Notification error:", err);
            }
        };

        setupNotifications();

        const subscription = Notifications.addNotificationResponseReceivedListener(response => {

            try {
                console.log("User clicked the notification!");  
            } catch (error) {
                console.log("Error handling subcription: ", error)
            }
        
            console.log(response);
            
             const { title, data } = response.notification.request.content;

            if (data.quoteId === subQuote.id) { 
                console.log("Navigating to Check-in screen...");
                setIsSubClicked(true);
            }
        });

        return () => subscription.remove();
        
    },[subQuote?.id]);

    const loadJsonFile = async () => {
        const filePath = `${RNFS.DocumentDirectoryPath}/user_data.json`;
        try {
            const exists = await RNFS.exists(filePath);
            
            if (exists) {
                const content = await RNFS.readFile(filePath, 'utf8');
                const jsonObject = JSON.parse(content);

                const randomIndex = Math.floor(Math.random() * jsonObject.length);

                setSubIndex(randomIndex);
                setJsonData(jsonObject);

                let x = {
                    char_name: jsonObject[randomIndex].char_name ,
                    anime: jsonObject[randomIndex].anime || '',
                    img_links: jsonObject[randomIndex].img_links || [],
                    quote: jsonObject[randomIndex].quote || '',
                    biography: jsonObject[randomIndex].biography || '',
                    wiki: jsonObject[randomIndex].wiki || ''
                }

                setSubQuote(x);
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
        <QuoteContext.Provider value={{ charQuery, jsonData, isLoading, charJson, isCharLoading, subQuote, subIndex, isSubClicked }}>
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
