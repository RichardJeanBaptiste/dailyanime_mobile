import * as RNFS from '@dr.pogodin/react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';


const supabaseUrl = Constants.expoConfig.extra.supabaseUrl ?? '';
const supabaseKey = Constants.expoConfig.extra.supabaseAnonKey ?? '';


export const supabase = createClient(
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

const saveJsonFile = async (jsonString) => {
  const fileName = 'user_data.json';
  const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  
  try {
    await RNFS.writeFile(path, jsonString, 'utf8');
    
    console.log(`Success! File saved at: ${path}`);
    return path;
  } catch (error) {
    console.error('Failed to write JSON file:', error);
    throw error;
  }
};



const exportTable = async () => {
  const { data , error } = await supabase.rpc('get_quotes_json');

  if (error) {
    console.log(error);
    throw error;
  }

  const json = JSON.stringify(data, null, 2);

  saveJsonFile(json);

  return json;
}

exportTable();










      