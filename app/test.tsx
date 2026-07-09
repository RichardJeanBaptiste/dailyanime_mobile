import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
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


function Example() {

    const getQuotes = async () => {
        const { data, error } = await supabase.rpc('get_quotes_json');

        if (error) throw error;

        return data;
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