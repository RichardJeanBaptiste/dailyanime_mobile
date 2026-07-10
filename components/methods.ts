import * as RNFS from '@dr.pogodin/react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import Constants from 'expo-constants';


const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? '';
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? '';

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


export const shuffleArray = <T>(array: T[]): T[] => {
  
  const shuffled = [...array]; 
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap elements at i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

export const getTimeFromString = (timeString: string) => {
  if (!timeString) return { hours: NaN, minutes: NaN };

  const clean = timeString.trim().toUpperCase();

  const parts = timeString.trim().toUpperCase().split(/\s+/);
  if (parts.length < 2) return { hours: NaN, minutes: NaN };

  const [time, modifier] = parts;
  const [hoursStr, minutesStr] = time.split(':');

  let hours = Number(hoursStr);
  let minutes = Number(minutesStr);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return { hours: NaN, minutes: NaN };
  }

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

export const saveJsonFile = async (filename: any , jsonString: any) => {
 
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