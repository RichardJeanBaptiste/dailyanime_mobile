/**
 *  TODO LIST
 * 
 *  Create App Rating
 *  Better Swiping Animation on the Quote Component
 *  Add Advertising 
 *  
 */

import useAppConstants from "@/hooks/useAppConstants";
import useScheduleNotification from "@/hooks/useScheduleNotification";
import useUserSettings from "@/hooks/useUserSettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
//import { ActivityIndicator } from 'react-native-paper';
import Constants from 'expo-constants';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { shuffleArray } from "../methods";
import { useSearchContext } from './QuoteContext';
import QuoteItem from "./QuoteItems";
import QuoteModal from "./QuoteModal";
import TutorialOverlay from "./TutorialOverlay";

//const adUnitId = 'ca-app-pub-4929537070408822/647380718';

const bannerUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : Constants?.expoConfig?.extra?.bannerId;

//const testBannerAd = TestIds.ADAPTIVE_BANNER;

export default function Quotes() {

    const isFocused = useIsFocused();

    const { userSettings, setTutorialSettings } = useUserSettings();
    const { schedulePosts, handlePushNotification, checkScheduledPosts } = useScheduleNotification();
    const { SCREEN_WIDTH } = useAppConstants();
    const { jsonData, isLoading, getRandomQuote } = useSearchContext();

    const [modalVisible, setModalVisible] = useState(false);

    const [quoteLog, setQuoteLog] = useState<number[]>([]);

    const [showTutorial, setShowTutorial] = useState<'none' | 'flex'>('none');

    const windowSize = 5;

    const halfWindow = Math.floor(windowSize / 2);

    const bannerRef = useRef<BannerAd>(null);

    useForeground(() => {
        Platform.OS === 'ios' && bannerRef.current?.load();
    });
 
    // Handle Push Notification Click Interaction
    useEffect(() => {
        handlePushNotification();
    },[]);


    // Retry DB when Quotes Empty
    useEffect(() => {
        if(jsonData.length == 0) {
            console.log("Empty Data Array")
        }
    },[jsonData]);

    const getNewRandom = async () => {
        let x = await getRandomQuote();
        schedulePosts(x);
    }
    
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
                getNewRandom();
            }
            
            const indices = Array.from({ length: jsonData.length }, (_, i) => i);

            const randomizedIndicies = shuffleArray(indices);

            setQuoteLog(randomizedIndicies);
            
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

                    <View style={styles.bannerContainer}>
                        <BannerAd
                            unitId={bannerUnitId}
                            size={BannerAdSize.BANNER}
                            requestOptions={{
                                networkExtras: {
                                    collapsible: 'bottom',
                                },
                            }}
                        />
                    </View>

                    
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
        flexDirection: 'row'
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
    bannerContainer: {
        position: 'absolute', 
        bottom: 10, 
        alignSelf: 'center', // Clean way to center horizontally
        width: '100%',       // Or 80%, depending on your design
        alignItems: 'center', 
        justifyContent: 'center',
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

   // const schedulePosts = async () => {
    //     //console.log("Sending Push Notifications")

    //     const { data , error } = await supabase.rpc('get_quotes_json');

    //     if(error) {
    //         console.log("Error getting Push Notification Post: ", error);
    //         return;
    //     }

    //     const randomIndex = Math.floor(Math.random() * (data.length || 100));

    //     let quote = await data[randomIndex];

    //     // Schedule Daily Quote

    //     const now = new Date();

    //     const {hours, minutes} = getTimeFromString(userSettings.NotificationTime);

    //     // if (
    //     //     Number.isNaN(hours) || Number.isNaN(minutes)
    //     // ) {
    //     //     console.log("Invalid time input:", userSettings.NotificationTime);
    //     //     console.log(typeof userSettings.NotificationTime);
    //     //     return;
    //     // }

    //     // console.log('hours:', hours, typeof hours);
    //     // console.log('minutes:', minutes, typeof minutes);

    //     await Notifications.cancelScheduledNotificationAsync(DAILY_QUOTE_ID);

    //     await Notifications.scheduleNotificationAsync({
    //         identifier: DAILY_QUOTE_ID,
    //         content: {
    //             title: quote.char_name,
    //             body: quote.quote,
    //             data: {quote},
    //         },
    //         trigger: {
    //             hour: hours,
    //             minute: minutes,
    //             repeats: true, 
    //             type: Notifications.SchedulableTriggerInputTypes.DAILY,
    //             channelId: 'daily-quotes'
    //         } as Notifications.DailyTriggerInput,
    //     });
    // }