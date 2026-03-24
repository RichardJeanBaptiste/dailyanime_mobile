import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface UserSettings {
    NotificationTime: string,
    isNotifications: boolean,
    showTutorial: boolean
}



export default function useUserSettings() {

    const [ userSettings, setUserSettings ] = useState<UserSettings>({
        NotificationTime: "08:00",
        isNotifications: false,
        showTutorial: true
    });

    useEffect(() => {
        getUserSettings();
    },[]);

    useEffect(() => {
        saveSettings();
    },[userSettings]);

    const getUserSettings = async () => {

        let x = await AsyncStorage.getItem("Settings");

        let items;

        if(x !== null) {
            items = JSON.parse(x);
        } else {
            console.log("No Settings Found");
            return
        }

        console.log(items);

        setUserSettings(items);
    }

    const saveSettings = async () => {

        await AsyncStorage.setItem("Settings", JSON.stringify(userSettings));
        console.log("Save New Settings");
    }

    const setNotifications = async (setNotifications: boolean) => {

        setUserSettings((prev) => {
            let x = setNotifications ? true : false; 

            return {
                ...prev,         
                isNotifications: x 
            };
        });
        
    } 

    return {
        userSettings,
        setNotifications,
    };
}
