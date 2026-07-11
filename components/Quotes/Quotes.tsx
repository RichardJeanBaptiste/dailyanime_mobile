/**
 *  TODO LIST
 * 
 *  Fix Settings Loading
 *  Unify Quote Loading to QuoteContext
 *      - character.tsx
 *      - daily.tsx
 *  Create App Rating
 *  Better Swiping Animation on the Quote Component
 *  Add Advertising 
 *  
 */

import useAppConstants from "@/hooks/useAppConstants";
import useUserSettings from "@/hooks/useUserSettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { useIsFocused, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";
//import { ActivityIndicator } from 'react-native-paper';
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTimeFromString, shuffleArray, supabase } from "../methods";
import { useSearchContext } from './QuoteContext';
import QuoteItem from "./QuoteItems";
import QuoteModal from "./QuoteModal";
import TutorialOverlay from "./TutorialOverlay";

//const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;  

export default function Quotes() {

    const DAILY_QUOTE_ID = 'daily-quote';

    const router = useRouter();
    const isFocused = useIsFocused();

    const { userSettings, setTutorialSettings } = useUserSettings();
    const { SCREEN_WIDTH } = useAppConstants();
    const { jsonData, isLoading,  updateDailyQuote, dailyQuote,  } = useSearchContext();

    const [modalVisible, setModalVisible] = useState(false);

    const [quoteLog, setQuoteLog] = useState<number[]>([]);

    const [showTutorial, setShowTutorial] = useState<'none' | 'flex'>('none');

    //const [displayIndex, setDisplayIndex] = useState(-1);

    const windowSize = 5;

    const halfWindow = Math.floor(windowSize / 2);

    const schedulePosts = async () => {
        //console.log("Sending Push Notifications")

        const { data , error } = await supabase.rpc('get_quotes_json');

        if(error) {
            console.log("Error getting Push Notification Post: ", error);
            return;
        }

        const randomIndex = Math.floor(Math.random() * (data.length || 100));

        let quote = await data[randomIndex];

        // Schedule Daily Quote

        const now = new Date();

        const {hours, minutes} = getTimeFromString(userSettings.NotificationTime);

        if (
            Number.isNaN(hours) || Number.isNaN(minutes)
        ) {
            //console.log("Invalid time input:", userSettings.NotificationTime);
            //console.log(typeof userSettings.NotificationTime);
            return;
        }

        // console.log('hours:', hours, typeof hours);
        // console.log('minutes:', minutes, typeof minutes);

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

    // Handle Push Notification Click Interaction
    useEffect(() => {
        try {
            // Handles Closed -> app launched from notification
            const lastResponse = Notifications.getLastNotificationResponse();

            if (lastResponse?.notification) {
                const subQuote = lastResponse.notification?.request?.content?.data?.quote;

                //console.log(subQuote);
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
    },[]);


    // Retry DB when Quotes Empty
    useEffect(() => {
        if(jsonData.length == 0) {
            console.log("Empty Data Array")
        }
    },[jsonData]);
    
    // Load JSON Data
    useEffect(() => {

        if(!isLoading && jsonData) {

            //setAppData(jsonData)
            
            if(userSettings.showTutorial) {
                
                setShowTutorial('flex');
                
            } else {
                //setShowTutorial('none');
                setTutorialSettings(false);
                console.log("User has seen tutorial")
            }


            if(userSettings.isNotifications) {
                schedulePosts();
            }
            
            const indices = Array.from({ length: jsonData.length }, (_, i) => i);

            const randomizedIndicies = shuffleArray(indices);

            setQuoteLog(randomizedIndicies);
            
            //setDisplayIndex(0);
        }
        
    },[isLoading, jsonData]);

    // Check if user should view tutorial on screen focus
    useEffect(() => {
        if (isFocused) {
            checkTutorial();
        }
    }, [isFocused]);

    const checkTutorial = async () => {
        let x = await AsyncStorage.getItem('settings');

        let items;

        if(x !== null) {
            items = JSON.parse(x);
        } else {
            console.log("No Settings Found");
            return
        }

        // console.log(items.showTutorial);

        if(items.showTutorial) {
            setShowTutorial('flex')
            setTutorialSettings(false);
        }
    }

    // Modal Functions 
    const [ activeQuote, setActiveQuote ] = useState({
        name: '',
        anime: '',
        biography: '',
        img_links: []
    });

    const setVisible = () => {
        setModalVisible(!modalVisible)
    }

    const setActive = useCallback((item: any) => {
        let x = {
            name: item?.char_name,
            anime: item?.anime,
            biography: item?.biography,
            img_links: item?.img_links,
            wiki: item?.wiki
        }

        setActiveQuote(x);
        setModalVisible(!modalVisible);
    },[]);

    const listRef = useRef<FlatList>(null);

    const scrollX = useSharedValue(0);

    const onScroll = (event: any) => {
        scrollX.value = event.nativeEvent.contentOffset.x;
    }

    const closeTutorial = () => {
        setShowTutorial('none')
    }
    
    
    if(isLoading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 24}} onPress={() => console.log(jsonData)}>Loading</Text>
            </SafeAreaView>
        )
    } else {
        return (
            <>
                <SafeAreaView style={[styles.quotes_container]}>
                    
                    {/*********************** Modal *************************/}
                    <QuoteModal currentQuote={activeQuote} modalVisible={modalVisible} setVisible={setVisible} />

                    {/* The Tutorial Overlay */}
                    {showTutorial === 'flex' && (
                        <View style={styles.tutorialWrapper}>
                            <TutorialOverlay closeTutorial={closeTutorial}/>
                        </View>
                    )} 

                                  
                    
                    {/****************************************** Quotes *******************************************/}
                    <FlatList
                        ref={listRef}
                        data={quoteLog}
                        pagingEnabled
                        horizontal
                        windowSize={10}
                        maxToRenderPerBatch={10}
                        removeClippedSubviews
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        initialNumToRender={3}
                        //onMomentumScrollEnd={handleMomentumScrollEnd}
                        showsHorizontalScrollIndicator={false}
                        getItemLayout={(data, index) => ({
                            length: SCREEN_WIDTH,
                            offset: SCREEN_WIDTH * index,
                            index,
                        })} 
                        renderItem={({item, index}) => <QuoteItem item={jsonData[item]} index={index} scrollX={scrollX} setActive={() => setActive(jsonData[item])}/>} 
                        keyExtractor={(item, index) => `${item}-${index}`}
                        ListEmptyComponent={<Text></Text>}      
                    />
                </SafeAreaView>
            </>
        );
    }
}


const styles = StyleSheet.create({
    quotes_container: {
        position: 'relative',
        flex: 1
    },
    title_container: {
        position: 'absolute',
        top: '0%',
        left: '0%',
        width: '100%',
        height: '20%',
        display: 'flex',
        flexDirection: 'row',
    },
    divider: {
        width: 'auto',
        height: '1%',
        backgroundColor: 'white'
    },
    text: {
        color: 'white'
    },
    quotes: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tutorialWrapper: {
    // This covers the entire screen
    ...StyleSheet.absoluteFill, 
    
    // Semi-transparent background
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    
    // Centers the tutorial component
    justifyContent: 'center', 
    alignItems: 'center',
    
    // Ensures it sits on top of everything else
    zIndex: 1000, 
    elevation: 1000, // Necessary for Android
  }
});
