import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

interface UserSettings {
    NotificationTime: string,
    isNotifications: boolean,
    showTutorial: boolean,
    isSoundOn: boolean,
    theme: string
}

const defaults = {
    NotificationTime: "08:00",
    isNotifications: false,
    showTutorial: true,
    isSoundOn: true,
    theme: "dark"
}


export default function useUserSettings() {

    const isLoaded = useRef(false);

    const [ userSettings, setUserSettings ] = useState<UserSettings>(defaults);

    useEffect(() => {
        getUserSettings();
    },[]);

    useEffect(() => {
        if(isLoaded.current) {
            saveSettings();
        }
    },[userSettings]);

    const getUserSettings = async () => {

        try {
            let x = await AsyncStorage.getItem("settings");

            let items;

            if(x !== null) {
                items = JSON.parse(x);
            } else {
                console.log("No Settings Found");
                return
            }

            //console.log("Items: ", items);
            setUserSettings(items);  
        } catch (error) {
            console.error("Load error", error);
        } finally {
            isLoaded.current = true;
        }
    }

    const saveSettings = async () => {

        await AsyncStorage.setItem("settings", JSON.stringify(userSettings));
        let x = await AsyncStorage.getItem("settings");

        //console.log("Save New Settings: ", x);
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
    
    const setSoundSettings = (isSoundOn: boolean) => {

        setUserSettings((prev) => {
            //let x = isSoundOn ? true : false

            return {
                ...prev,
                isSoundOn: isSoundOn
            }
        })
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
        
        try {

            await AsyncStorage.removeItem('Backup');
            await AsyncStorage.removeItem('quotes');
            await AsyncStorage.setItem('settings', JSON.stringify(defaults));

            //console.log("Reset Settings");
        } catch (error) {
            console.error("Error reseting app : ", error);
        }
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
                await AsyncStorage.setItem('settings', JSON.stringify(data.settings));
                console.log("Restored from backups")
            }
            return 
            
        } catch (error) {
            
            Alert.alert("Failed to restore backup");
            console.error(error);
        }
    }

    return {
        userSettings,
        setNotifications,
        setNotificationTime,
        setSoundSettings,
        createBackup,
        showBackup,
        resetSettings,
        clearQuotes,
        restoreFromBackup
    };
}
