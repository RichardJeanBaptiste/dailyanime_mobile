import { QuoteProvider } from "@/components/QuoteContext";
import Quotes from "@/components/Quotes";
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Index() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

 

  useEffect(() => {

    try {
      
      registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
     
      

      Notifications.setNotificationChannelAsync('daily-quotes', {
        name: 'Daily Quotes',
        importance: Notifications.AndroidImportance.HIGH,
      });

      if (Platform.OS === 'android') {
        Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
      }
      const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });


        return () => {
            notificationListener.remove();
            responseListener.remove();
        };

    } catch (error) {
      console.error("Push Notification Error: ",error);
    }
    

  }, []);



    return (
      <QuoteProvider>
        <View style={styles.container}>
          <Quotes/>
        </View>
      </QuoteProvider>
    );
  
}


async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      //console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  }
});

