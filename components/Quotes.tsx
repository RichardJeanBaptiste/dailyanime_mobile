import { Image } from "expo-image";
import * as Notifications from 'expo-notifications';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { QuoteLogItem2 } from "./Interfaces";
import QuoteButtons from "./QuoteButtons";
import { useSearchContext } from './QuoteContext';
import QuoteModal from "./QuoteModal";
import { shuffleArray } from './methods';

const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;  

export default function Quotes() {

    const { jsonData, isLoading, subQuote, subIndex } = useSearchContext();

    const [imageUriIndex, setImageUriIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);

    const [data, setAppData] = useState<QuoteLogItem2[]>([]);

    const [quoteLog, setQuoteLog] = useState<number[]>([]);

    const [displayIndex, setDisplayIndex] = useState(-1);

    const [currentQuote, setCurrentQuote] = useState({
        name: data?.[quoteLog[displayIndex]]?.char_name ,
        anime: data?.[quoteLog[displayIndex]]?.anime || '',
        img_links: data?.[quoteLog[displayIndex]]?.img_links || [],
        quote: data?.[quoteLog[displayIndex]]?.quote || '',
        biography: data?.[quoteLog[displayIndex]]?.biography || '',
        wiki: data?.[quoteLog[displayIndex]]?.wiki || ''
    });

    async function setupNotifications(subQuote: any) {


        try {   

            console.log("Setting up notfications");

            // Optional: Cancel all previous notifications to avoid duplicates
            await Notifications.cancelAllScheduledNotificationsAsync();

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: subQuote.name,
                    body: subQuote.quote,
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: 11, 
                    minute: 21,
                },
            });
            
        } catch (error) {
            console.log("Error setting up notifications: ", error);
        }

        
    }


    const subscription = Notifications.addNotificationResponseReceivedListener(response => {

        try {
            console.log("User clicked the notification!");  
        } catch (error) {
            console.log("Error handling subcription: ", error)
        }
    
         
        
        //console.log(response);
        
        // const title = response.notification.request.content.title;

        // if (title === subQuote.name) {
        //     // Navigate to a specific screen or perform an action
        //     console.log("Navigating to Check-in screen...");

        //         //console.log(randomSubQuote.quote);

        //         setQuoteLog((prevLog) => {
        //             const newLog = [...prevLog];

        //             newLog[displayIndex] = subIndex;
        //             return newLog;
        //         });

        //         setDisplayIndex(subIndex);
        //         //setQuoteLog();
        //     }
    });


    useEffect(() => {
        
        if(subQuote !== undefined) {

            console.log(subQuote.quote);
            

            let x = {
                name: "test",
                quote: 'test_quote'
            }
            
            try {
                setupNotifications(x);
                return () => subscription.remove();
            } catch (error) {
                console.log(error);
            }
            
        }
    },[subQuote]);
   


    useEffect(() => {

        if(!isLoading && jsonData) {
            
            // Setup Quotes Component
            setAppData(jsonData);

            const indices = Array.from({ length: jsonData.length }, (_, i) => i);

            const randomizedIndicies = shuffleArray(indices);

            setQuoteLog(randomizedIndicies);

            setDisplayIndex(0);
        }
        
    },[isLoading, jsonData]);


    useEffect(() => {

        if(data.length == 0 || data !== undefined) {
            setCurrentQuote({
                name: data?.[quoteLog[displayIndex]]?.char_name ,
                anime: data?.[quoteLog[displayIndex]]?.anime || '',
                img_links: data?.[quoteLog[displayIndex]]?.img_links || [],
                quote: data?.[quoteLog[displayIndex]]?.quote || '',
                biography: data?.[quoteLog[displayIndex]]?.biography || '',
                wiki: data?.[quoteLog[displayIndex]]?.wiki || ''
            });
        }
        
    },[displayIndex]);

    

    const panResponder = useMemo(() => {

        const nextQuote = () => {

            setDisplayIndex(prevIndex => {
                const nextIndex = prevIndex + 1;

                if(nextIndex >= data.length) {
                    //console.log("End of array");
                    return prevIndex;
                }

                return nextIndex;
            });
        }

        const previousQuote = () => {

            setDisplayIndex(prevIndex => {
                
                const nextIndex = prevIndex - 1;

                if( nextIndex < 0) {
                    //console.log("Start");
                    return prevIndex;
                }

                return nextIndex;
            });

        }

        return PanResponder.create({
            onStartShouldSetPanResponder: () => false,

            onMoveShouldSetPanResponder: (evt, gesture) => {
                const { dx, dy } = gesture;
                return Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy);
            },

            onPanResponderRelease: (evt, gesture) => {
                const { dx } = gesture;

                if (Math.abs(dx) >= SWIPE_THRESHOLD) {
                    if (dx > 0) {
                        //console.log("Left Swipe");
                        previousQuote();
                    } else {
                        //console.log("Right Swipe");
                        nextQuote();
                    }
                }
            }
        });

    }, [displayIndex, data]);


    const cycleImages = () => {

        console.log(`Image Error: ${currentQuote.img_links[imageUriIndex]}`)

        setImageUriIndex( imageUriIndex + 1 )

        setImageUriIndex( prevIndex => {
            const newIndex = prevIndex + 1;

            return newIndex;
        })

        if(imageUriIndex > currentQuote.img_links.length) {
            console.log("No Images");
        }
    }

    const setVisible = () => {
        setModalVisible(!modalVisible)
    }


    if(isLoading) {
        return (
            <View>
                <Text style={{ color: 'white', fontSize: 24}}>Loading</Text>
            </View>
        )
    } else {
        return (
            <>
                <View style={styles.quotes_container}>
                    {/*********************** Modal *************************/}
                    <QuoteModal 
                        currentQuote={{
                            name: data?.[quoteLog[displayIndex]]?.char_name,
                            anime: data?.[quoteLog[displayIndex]]?.anime,
                            biography: data?.[quoteLog[displayIndex]]?.biography,
                            wiki: data?.[quoteLog[displayIndex]]?.wiki,
                            img_links: data?.[quoteLog[displayIndex]]?.img_links || []
                        }} 
                        modalVisible={modalVisible} 
                        setVisible={setVisible}
                    />

                    {/*************************** Title *****************************/}
                    <View style={styles.title_container}>
                            <View style={{ flex: .3, marginTop: '9%', marginLeft: '8%' }}>
                                <Pressable onPress={() => setModalVisible(true)}>
                                    {/* Only render the Image component if the URL is a non-empty string */}
                                        {data?.[quoteLog[displayIndex]]?.img_links[imageUriIndex] ? (
                                            
                                        <Image
                                            style={{ width: 75, height: 75, borderRadius: 35 }}
                                            source={{ uri: data?.[quoteLog[displayIndex]]?.img_links[imageUriIndex] }}
                                            cachePolicy="memory-disk"
                                            contentFit="fill"
                                            contentPosition={"bottom left"}
                                            onError={cycleImages} 
                                        />
                                    ) : (

                                        <Image
                                            style={{ width: 75, height: 75, borderRadius: 35 }}
                                            source={PlaceholderImage}
                                            onError={cycleImages} 
                                        />
                                    )}
                                </Pressable>
                            </View>

                            <View style={{flex: .7, display: 'flex', flexDirection: 'column', marginTop: '10%', marginLeft: '4%'}}>
                                <Text style={[styles.text, {fontSize: 18}]}>{data?.[quoteLog[displayIndex]]?.char_name}</Text>
                                <Text style={[styles.text, {marginTop: '5%'} ]}>{data?.[quoteLog[displayIndex]]?.anime || ''}</Text>
                            </View>
                    </View>

                    {/********************** Quotes **************************/}
                    
                    <View style={styles.quotes}>

                            {/***********************************  FULL SWIPE AREA *****************************************/}

                            <View
                                style={{ flex: 1, width: '100%', height: '100%' }}
                                pointerEvents="box-only"
                                {...panResponder.panHandlers}
                            >
                                <View 
                                    style={{ width: '80%', height: '100%', alignSelf: 'center', justifyContent: 'center' }}
                                >
                                    <Text style={{ color: 'white', width: '100%',fontSize: 24}}>{currentQuote.quote}</Text>
                                </View>
                            </View>
                    </View>

                    {/********************** Quote Buttons ******************/}

                    <QuoteButtons wikiLink={data?.[quoteLog[displayIndex]]?.wiki || ''} quote={data?.[quoteLog[displayIndex]]?.quote || ''} name={data?.[quoteLog[displayIndex]]?.char_name || ''}/>

                </View>
            </>
        );
        }
    }




/**

    

        
        
        
 */


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

