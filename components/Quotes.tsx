import { Image } from "expo-image";
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

    const { jsonData, isLoading } = useSearchContext();

    const [imageUriIndex, setImageUriIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);

    const [data, setAppData] = useState<QuoteLogItem2[]>([]);

    const [quoteLog, setQuoteLog] = useState<number[]>([]);

    const [displayIndex, setDisplayIndex] = useState(0);

    const [currentQuote, setCurrentQuote] = useState({
        name: data?.[quoteLog[displayIndex]]?.char_name ,
        anime: data?.[quoteLog[displayIndex]]?.anime || '',
        img_links: data?.[quoteLog[displayIndex]]?.img_links || [],
        quote: data?.[quoteLog[displayIndex]]?.quote || '',
        biography: data?.[quoteLog[displayIndex]]?.biography || '',
        wiki: data?.[quoteLog[displayIndex]]?.wiki || ''
    });


    useEffect(() => {

        if(!isLoading && jsonData) {
            
            setAppData(jsonData);

            const indices = Array.from({ length: jsonData.length }, (_, i) => i);

            const randomizedIndicies = shuffleArray(indices);

            setQuoteLog(randomizedIndicies);

        }
        
    },[isLoading, jsonData]);

    
    

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
                                    <Text style={{ color: 'white', width: '100%',fontSize: 24}}>{data?.[quoteLog[displayIndex]]?.quote || ''}</Text>
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

    const getSubQuote = async () => {
          
        //     let x = {
        //         name: data?.[displayIndex]?.char_name ,
        //         anime: data?.[displayIndex]?.anime || '',
        //         img_links: data?.[displayIndex]?.img_links || [],
        //         quote: data?.[displayIndex]?.quote || '',
        //         biography: data?.[displayIndex]?.biography || '',
        //         wiki: data?.[displayIndex]?.wiki || ''
        //     }

        //     //setQuoteLog((prevLog) => [x, ...prevLog]);

        //     return x;
        // }

        // async function setupNotifications() {

        //     // Optional: Cancel all previous notifications to avoid duplicates
        //     await Notifications.cancelAllScheduledNotificationsAsync();

        //     await Notifications.scheduleNotificationAsync({
        //         content: {
        //             title: (await getSubQuote()).name,
        //             body: (await getSubQuote()).quote,
        //         },
        //         trigger: {
        //             type: Notifications.SchedulableTriggerInputTypes.DAILY,
        //             hour: 11, 
        //             minute: 21,
        //         },
        //     });
        // }
        
        // const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        //     // This is your "callback" logic
        //     console.log("User clicked the notification!");            
             
        //     // Example: Check which notification was clicked
        //     const title = response.notification.request.content.title;
        //     if (title === "Daily Check-in") {
        //         // Navigate to a specific screen or perform an action
        //         console.log("Navigating to Check-in screen...");

        //         // getSubQuote().then(quoteData => {
        //         //     // This runs once the Supabase data is fetched
        //         //     console.log(quoteData);
        //         //     setCurrentQuote(quoteData); 
                
        //         //     // If you use navigation, you might put it here or outside
        //         //     // navigation.navigate('QuoteDetail', { data: quoteData });
        //         // }).catch(err => {
        //         //     console.error("Error fetching sub quote:", err);
        //         // });
        //     }
        // });

        // setupNotifications();
        // return () => subscription.remove();
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

