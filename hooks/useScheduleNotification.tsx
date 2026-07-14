import { getTimeFromString } from "@/components/methods";
import { useSearchContext } from "@/components/Quotes/QuoteContext";
import useUserSettings from "@/hooks/useUserSettings";
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

export default function useScheduleNotification() {

    const DAILY_QUOTE_ID = 'daily-quote';

    const { dailyQuote, updateDailyQuote, getRandomQuote } = useSearchContext();
    const { userSettings } = useUserSettings();
    const router = useRouter();

    const schedulePosts = async () => {

        const quote = getRandomQuote();

        const { hours, minutes } = getTimeFromString(userSettings.NotificationTime);

        await Notifications.cancelScheduledNotificationAsync(DAILY_QUOTE_ID);

        await Notifications.scheduleNotificationAsync({
            identifier: DAILY_QUOTE_ID,
            content: {
                title: quote.char_name,
                body: quote.quote,
                data: {quote},
            },
            trigger: {
                hour: hours,
                minute: minutes,
                repeats: true, 
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                channelId: 'daily-quotes'
            } as Notifications.DailyTriggerInput,
        });
    }

    const handlePushNotification = () => {
        try {
            // Handles Closed -> app launched from notification
            const lastResponse = Notifications.getLastNotificationResponse();

            if (lastResponse?.notification) {
                const subQuote = lastResponse.notification?.request?.content?.data?.quote;

                console.log("Sub Quote: ",subQuote);
                updateDailyQuote(subQuote);
            }

            // Background / Foreground -> notification tapped
            const subscription = Notifications.addNotificationResponseReceivedListener(response => {
                const subQuote = response.notification?.request?.content?.data?.quote;

                setTimeout(() => {
                    updateDailyQuote(subQuote);
                    router.push('/daily');
                }, 0);
            })

            return () => subscription.remove();
        } catch (error) {
            console.log("Error During Intial Mount: ", error);
        }
    }

    return {
        schedulePosts,
        handlePushNotification
    }
}