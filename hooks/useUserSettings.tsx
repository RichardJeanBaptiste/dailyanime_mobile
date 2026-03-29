import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

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

        let x = {
            quotes: currentBookmarks,
            settings: userSettings
        }

        await AsyncStorage.setItem('Backup', JSON.stringify(x));
        console.log("Backup Created");
    }

    const showBackup = async () => {

        let backup = await AsyncStorage.getItem('Backup');
        
        if(backup == null) {
            console.log("Backup empty");
            return
        }
        console.log(backup);
    }

    const resetSettings = async () => {
        
        await AsyncStorage.removeItem('Backup');
        await AsyncStorage.removeItem('quotes');

        let defaults = {
            NotificationTime: "08:00",
            isNotifications: false,
            showTutorial: true
        }

        await AsyncStorage.setItem('Settings', JSON.stringify(defaults));
    }

    const clearQuotes = async () => {

        await AsyncStorage.removeItem('quotes');

        console.log("Quotes Cleared");
    }

    const restoreFromBackup = async () => {
        try {

            let backup = await AsyncStorage.getItem('Backup');

            let data;
            
            if(backup) {
                data = JSON.parse(backup);
            }

            if(data) {
                await AsyncStorage.setItem("quotes", data.quotes);
                await AsyncStorage.setItem('Settings', JSON.stringify(data.settings));
            }
            return 
            
        } catch (error) {
            
            Alert.alert("Failed to create backup");
            console.error(error);
        }
    }

    return {
        userSettings,
        setNotifications,
        setNotificationTime,
        createBackup,
        showBackup,
        resetSettings,
        clearQuotes,
        restoreFromBackup
    };
}
