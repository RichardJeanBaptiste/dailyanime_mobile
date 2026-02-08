import * as RNFS from '@dr.pogodin/react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch } from "@react-native-community/netinfo";
import { createClient, processLock } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from "react-native";
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

const checkConnection = async () => {
  fetch().then(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
  });
}

checkConnection();


const saveJsonFile = async (filename , jsonString) => {
 
  const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
 
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

  try {
    const { data , error } = await supabase.rpc('get_quotes_json');

    if (error) {
      if(error.details.startsWith("TypeError: Network request failed")) {
        console.log("Failed to connect to supabase: Function: get_quotes_json : ", Platform.OS, " :",Platform.Version);
      } else {
        console.log("Error exporting table: ", error);
      }
    }

    const json = JSON.stringify(data, null, 2);

    saveJsonFile('user_data.json', json);

    return json;
  } catch (error) {
    console.log("Error exporting table: ", error);
  }

}

const exportCharTable = async () => {

  try {

    const { data , error } = await supabase
    .from('characters')
    .select('*')

    if (error) {
      if(error.details.startsWith("TypeError: Network request failed")) {
        console.log("Failed to connect to supabase: Function: get_chars : ", Platform.OS, " :",Platform.Version);
      } else {
        console.log("Error exporting table: ", error);
      }
    }

    const json = JSON.stringify(data, null, 2);

    saveJsonFile('characters.json', json);

    return json;
    
  } catch (error) {
    console.log("Error exporting Char Table: ", error);
  }
  
}

//exportTable();
//exportCharTable();


