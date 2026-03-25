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

    const setNotifications = (setNotifications: boolean) => {

        setUserSettings((prev) => {
            let x = setNotifications ? true : false; 

            return {
                ...prev,         
                isNotifications: x 
            };
        }); 
    } 

    const setNotificationTime = (newTimeObject: Date) => {

        let newTime = newTimeObject.toLocaleTimeString('en-US');

        setUserSettings((prev) => {
            return {
                ...prev,
                NotificationTime: newTime
            }
        })
    }

    const createBackup = async () => {

        let currentBookmarks = await AsyncStorage.getItem('quotes')

        if(currentBookmarks == null) {
            return;
        }

        //console.log(currentBookmarks);

        let x = {
            quotes: currentBookmarks,
            settings: userSettings
        }

        await AsyncStorage.setItem('Backup', JSON.stringify(x));
    }

    const showBackup = async () => {

        let backup = await AsyncStorage.getItem('Backup');
        
        if(backup == null) {
            console.log("Backup empty");
            return
        }
        console.log(backup);
    }

    return {
        userSettings,
        setNotifications,
        setNotificationTime,
        createBackup,
        showBackup
    };
}
