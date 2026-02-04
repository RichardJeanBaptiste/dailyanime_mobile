import * as Notifications from 'expo-notifications';

export const setupNotificationListener = (
  onNotificationPress: (data: any) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    onNotificationPress(data);
  });
};