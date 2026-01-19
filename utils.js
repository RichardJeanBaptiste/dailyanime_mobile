import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';
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

const exportTable = async () => {
  const { data , error } = await supabase.rpc('get_quotes_json');

  if (error) {
    console.log(error);
    throw error;
  }

  const json = JSON.stringify(data, null, 2);

  ///console.log(`======================================== JSON =============================\n\n${json}`);

  return json;
}

let jsonDump = exportTable();

const saveJsonToDbAsync = async (jsonDump) => {
  const db = await SQLite.openDatabaseAsync('anime_quotes.db');

  try {
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS quotes (
          id INTEGER PRIMARY KEY,
          quote TEXT,
          character TEXT,
      );
    `);

    await db.withTransactionAsync(async () => {
        const statement = await db.prepareAsync(
          'INSERT OR REPLACE INTO quotes (id, quote, character) VALUES (?, ?, ?, ?)'
        );

        try {

          for (const item of jsonDump) {
            await statement.executeAsync([
                item.id,
                item.quote,
                item.character
            ]);
          }

        } finally {
          await statement.finalizeAsync();
        }
    });

    console.log("Write Complete");
  } catch (error) {
    console.error("Async write failed: ", error);
  }
}
      