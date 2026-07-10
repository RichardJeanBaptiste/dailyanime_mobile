import { saveJsonFile } from '@/components/methods';
import * as RNFS from '@dr.pogodin/react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from "@react-native-community/netinfo";
import { createClient, processLock } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';


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


const queryClient = new QueryClient();
const filePath = `${RNFS.DocumentDirectoryPath}/quotes.json`;


function Example() {

    const [isOnline, setIsOnline] = useState(false);
    const [dbOnline, setDBOnline] = useState(false);

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
                setIsOnline(true);
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
                    return jsonObject; // React Query will receive this as data
                }
            }
        } catch (error) {
            console.error("Error reading offline backup file:", error);
        }
 
        return [];
    }

    const { isPending, error, data } = useQuery({
        queryKey: ['quoteData'],
        queryFn: getQuotes
    })

    if (isPending) return <Text>'Loading...'</Text>;

    if (error) return <Text>{'An error has occured: ' + error.message}</Text>;

    return (
        <View>
            <Text onPress={() => console.log(data[0])}>Example</Text>
            <Text>{data[0].quote}</Text>
            <Text>{data[0].char_name}</Text>
            <Text>Online Status: {isOnline ? "True" : "False"}</Text>
            <Text>Database Status: {dbOnline ? "True": "False"}</Text>
        </View>
    )
}

export default function TestStuff() {
    return (
        <QueryClientProvider client={queryClient}>
            <View>
                <Text style={{ fontSize: 24 }}>Test Page</Text>
                <Example/>
            </View>
        </QueryClientProvider> 
    )
}