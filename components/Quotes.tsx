/**
 *  TODO LIST
 * 
 *  Fix background sync 
 *  Better Swiping Animation on the Quote Component
 *  Create App Tutorial Functionality
 *  Add Advertising 
 */

import useUserSettings from "@/hooks/useUserSettings";
import { supabase } from "@/utils";
import { Image } from "expo-image";
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { QuoteLogItem } from "./Interfaces";
import { getTimeFromString, shuffleArray } from "./methods";
import QuoteButtons from "./QuoteButtons";
import { useSearchContext } from './QuoteContext';
import QuoteModal from "./QuoteModal";

const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;  
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis purus nec nisl molestie, vitae rutrum dolor vestibulum. Aenean pretium facilisis metus. Aliquam justo justo, luctus porttitor imperdiet ut, eleifend ut ipsum. Vivamus ultricies rhoncus velit in faucibus. Suspendisse tempus scelerisque dui at congue. Morbi eu nulla justo. Vivamus vehicula augue a dolor fringilla venenatis non vitae nisi. Donec tempus dui eget libero fringilla imperdiet. Vivamus at elementum enim, in interdum ligula. Donec quis enim fermentum, tincidunt arcu at, eleifend purus.

Praesent quis ligula erat. Etiam accumsan efficitur risus non mattis. Proin cursus metus metus, at maximus urna lobortis sit amet. Nullam eu maximus tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi congue metus odio, ac facilisis dui pretium ac. Etiam consequat leo ut tellus dapibus, non vestibulum mauris ornare. In gravida efficitur odio ac ultrices. Fusce vestibulum erat libero, id consequat odio tempor et. Sed ligula odio, commodo nec ultricies eu, interdum eget turpis. Pellentesque sapien purus, sagittis porta sapien id, consequat luctus nisl. Ut at nisl at eros faucibus placerat.`

export default function Quotes() {

    const DAILY_QUOTE_ID = 'daily-quote';

    const router = useRouter();

    const { userSettings } = useUserSettings();
    const { jsonData, isLoading,  updateDailyQuote, dailyQuote } = useSearchContext();

    const [imageUriIndex, setImageUriIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);

    const [data, setAppData] = useState<QuoteLogItem[]>([]);

    const [quoteLog, setQuoteLog] = useState<number[]>([]);

    const [displayIndex, setDisplayIndex] = useState(-1);

    const windowSize = 5;

    const halfWindow = Math.floor(windowSize / 2);

    const schedulePosts = async () => {
        console.log("Sending Push Notifications")

        const { data , error } = await supabase.rpc('get_quotes_json');

        if(error) {
            console.log("Error getting Push Notification Post: ", error);
            return;
        }

        const randomIndex = Math.floor(Math.random() * (data.length || 100));

        let quote = await data[randomIndex];

        // Schedule Daily Quote

        console.log(userSettings.NotificationTime);

        const now = new Date();

        const {hours, minutes} = getTimeFromString(userSettings.NotificationTime);

        if (
            Number.isNaN(hours) || Number.isNaN(minutes)
        ) {
            console.log("Invalid time input:", userSettings.NotificationTime);
            console.log(typeof userSettings.NotificationTime);
            return;
        }

        console.log('hours:', hours, typeof hours);
        console.log('minutes:', minutes, typeof minutes);

        await Notifications.cancelScheduledNotificationAsync(DAILY_QUOTE_ID);

        await Notifications.scheduleNotificationAsync({
            identifier: DAILY_QUOTE_ID,
            content: {
                title: quote.char_name,
                body: quote.quote,
                data: {quote}
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
                const subQuote = lastResponse.notification.request.content.data.quote;

                console.log(subQuote);

                setTimeout(() => {
                    updateDailyQuote(subQuote);
                    router.push('/daily');
                }, 0);
            }

            // Background / Foreground -> notification tapped

            const subscription = Notifications.addNotificationResponseReceivedListener(response => {
                const subQuote = response.notification.request.content.data.quote;

                updateDailyQuote(subQuote);
            })

            return () => subscription.remove();
        } catch (error) {
            console.log("Error During Intial Mount: ", error);
        }
    },[]);
    
    // Load JSON Data
    useEffect(() => {

        if(!isLoading && jsonData) {

            setAppData(jsonData)

            schedulePosts();
            
            const indices = Array.from({ length: jsonData.length }, (_, i) => i);

            const randomizedIndicies = shuffleArray(indices);

            setQuoteLog(randomizedIndicies);
            
            setDisplayIndex(0);
        }
        
    },[isLoading, jsonData]);


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

    const QuoteItem = memo(({item, index, scrollX, setActive}: {item: QuoteLogItem, index: number, scrollX: any, setActive: any}) => {

        const animatedStyle = useAnimatedStyle(() => {
        
            const inputRange = [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH
            ];

            const rotateY = interpolate(
                scrollX.value,
                inputRange,
                [45, 0 , -45]
            );

            const scale = interpolate(
                scrollX.value, 
                inputRange,
                [0.8, 1, 0.8]
            );

            return {
                transform: [
                    { perspective: 1000 },
                    { rotateY: `${rotateY}deg` },
                    { scale }
                ],
            };
        });
        
        return (
            <MotiView 
                from={{ opacity: 0, scale: 0.9, translateX: 50 }}
                animate={{ opacity: 1, scale: 1, translateX: 0 }}
                transition={{ type: 'spring', delay: index * 100}}
                style={[
                    { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'relative'},
                    animatedStyle
                ]}
            >
                {/*************************** Title *****************************/}
                    <View style={{ width: '100%', height: '30%',position: 'absolute', top: '2%', display: 'flex', flexDirection: 'row', }}>
                        <View style={{ flex: .3, marginTop: '9%', marginLeft: '8%' }}>
                            <Pressable onPress={setActive}>
                                {/* Only render the Image component if the URL is a non-empty string */}
                                    {item?.img_links[imageUriIndex] ? (
                                        
                                    <Image
                                        style={{ width: 75, height: 75, borderRadius: 35 }}
                                        source={{ uri: item?.img_links[imageUriIndex] }}
                                        cachePolicy="memory-disk"
                                        contentFit="fill"
                                        contentPosition={"bottom left"}
                                    />
                                ) : (

                                    <Image
                                        style={{ width: 75, height: 75, borderRadius: 35 }}
                                        source={PlaceholderImage}
                                    />
                                )}
                            </Pressable>
                        </View>

                        <View style={{flex: .7, display: 'flex', flexDirection: 'column', marginTop: '10%', marginLeft: '4%'}}>
                            <Text style={[styles.text, {fontSize: 18}]} onPress={() => console.log(data[0])}>{item?.char_name}</Text>
                            <Text style={[styles.text, {marginTop: '5%'} ]}>{item?.anime || ''}</Text>       
                        </View>
                    </View>
                
                <View style={{ position: 'absolute', top: '25%',  width: '100%', height: '40%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text 
                        style={{ color: 'white', fontSize: 24, textAlign: 'center', width:'75%'}}
                    >
                        {item?.quote}
                    </Text>
                </View>

                {/********************** Quote Buttons ******************/}
                <View style={{ position: 'absolute', top: '65%', height: '10%', width: '100%'}}>
                    <QuoteButtons wikiLink={item?.wiki || ''} quote={item?.quote || ''} name={item?.char_name || ''}/>
                </View>
            </MotiView>
        )
    });

    
    
    if(isLoading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 24}}>Loading</Text>
            </SafeAreaView>
        )
    } else {
        return (
            <>
                <SafeAreaView style={styles.quotes_container}>
                    
                    {/*********************** Modal *************************/}
                    <QuoteModal currentQuote={activeQuote} modalVisible={modalVisible} setVisible={setVisible} />

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
                        ListEmptyComponent={<Text>Empty List</Text>}      
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
});
