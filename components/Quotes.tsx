import { supabase } from "@/utils";
import { Image } from "expo-image";
import * as Notifications from 'expo-notifications';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { QuoteLogItem } from "./Interfaces";
import QuoteButtons from "./QuoteButtons";
import { QuoteProvider } from "./QuoteContext";
import QuoteModal from "./QuoteModal";

const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;  

export default function Quotes() {

    const [currentQuote, setCurrentQuote] = useState({
        name: '',
        anime: '',
        img_links: [],
        quote: '',
        biography: '',
        wiki: ''
    });

    const [imageUriIndex, setImageUriIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);

    const [quoteLog, setQuoteLog] = useState<QuoteLogItem[]>([]);

    const [logIndex, setLogIndex] = useState(0);


    useEffect(() => {
        getQuote();


        const getSubQuote = async () => {
            const { data, error } = await supabase.rpc('get_multiples');

            if(error) {
                console.log('supabase error with subscription', error);
            }

            //console.log("Current Sub Quote\n===============================\n",data);

            let x = {
                name: data[0].name || '',
                anime: data[0].anime || '',
                img_links: data[0].img_links || ['https://img.freepik.com/free-photo/anime-style-illustration-rose_23-2151548355.jpg','',''],
                quote: data[0].quote || '',
                biography: data[0].biography || '',
                wiki: data[0].wiki || '' 
            }

            setQuoteLog((prevLog) => [x, ...prevLog]);

            return x;
        }

        async function setupNotifications() {

            
            // Optional: Cancel all previous notifications to avoid duplicates
            await Notifications.cancelAllScheduledNotificationsAsync();

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: (await getSubQuote()).name,
                    body: (await getSubQuote()).quote,
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: 11, 
                    minute: 21,
                },
            });
        }
        
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            // This is your "callback" logic
            console.log("User clicked the notification!");            
             
            // Example: Check which notification was clicked
            const title = response.notification.request.content.title;
            if (title === "Daily Check-in") {
                // Navigate to a specific screen or perform an action
                console.log("Navigating to Check-in screen...");

                // getSubQuote().then(quoteData => {
                //     // This runs once the Supabase data is fetched
                //     console.log(quoteData);
                //     setCurrentQuote(quoteData); 
                
                //     // If you use navigation, you might put it here or outside
                //     // navigation.navigate('QuoteDetail', { data: quoteData });
                // }).catch(err => {
                //     console.error("Error fetching sub quote:", err);
                // });
            }
        });

        setupNotifications();
        return () => subscription.remove();
    },[]);

    useEffect(() => {

        if (quoteLog.length > 0) {
            const index = quoteLog.length - 1; 
            const selectedQuote = quoteLog[index];

            setCurrentQuote({
                name: selectedQuote.name || '',
                anime: selectedQuote.anime || '',
                img_links: selectedQuote.img_links || ['https://img.freepik.com/free-photo/anime-style-illustration-rose_23-2151548355.jpg','',''],
                quote: selectedQuote.quote || '',
                biography: selectedQuote.biography || '',
                wiki: selectedQuote.wiki || ''
            });
        }

    },[quoteLog]);

    

    const panResponder = useMemo(() => {

        const nextQuote = () => {
        
            let index = logIndex + 1;


            if (index >= quoteLog.length) {
                console.log("End of array")
                addMoreQuotes();
                return
            }

            setCurrentQuote({
                name: quoteLog[index].name || '',
                anime: quoteLog[index].anime || '',
                img_links: quoteLog[index].img_links || ['https://img.freepik.com/free-photo/anime-style-illustration-rose_23-2151548355.jpg','',''],
                quote: quoteLog[index].quote || '',
                biography: quoteLog[index].biography || '',
                wiki: quoteLog[index].wiki || ''
            });

            setLogIndex(index);
        }

        const previousQuote = () => {

            let index = logIndex - 1;

            if(index < 0){
                return 
            }

            setCurrentQuote({
                name: quoteLog[index].name || '',
                anime: quoteLog[index].anime || '',
                img_links: quoteLog[index].img_links || ['https://img.freepik.com/free-photo/anime-style-illustration-rose_23-2151548355.jpg','',''],
                quote: quoteLog[index].quote || '',
                biography: quoteLog[index].biography || '',
                wiki: quoteLog[index].wiki || ''
            });

            setLogIndex(index)
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

    }, [logIndex, quoteLog]);


    const getQuote = async () => {

        const { data, error } = await supabase.rpc('get_multiples')

        if(error) {
            console.log('RPC Error:' , error)
        } else {
            
            setQuoteLog(prevLog => [...prevLog, ...data]) 

            setCurrentQuote({
                name: data[logIndex].name || '',
                anime: data[logIndex].anime || '',
                img_links: data[logIndex].img_links || ['https://img.freepik.com/free-photo/anime-style-illustration-rose_23-2151548355.jpg','',''],
                quote: data[logIndex].quote || '',
                biography: data[logIndex].biography || '',
                wiki: data[logIndex].wiki || ''
            })
        }
    }

    const addMoreQuotes = async () => {

        const { data, error } = await supabase.rpc('get_multiples');

        if(error) {
            console.error('RPC Error: ', error)
        } else {

            setQuoteLog(prevLog => [...prevLog, ...data]) 

        }
    }


    const cycleImages = () => {

        console.log(`Image Error: ${currentQuote.img_links[imageUriIndex]}`)

        setImageUriIndex( imageUriIndex + 1)

        if(imageUriIndex > currentQuote.img_links.length) {
            console.log("No Images");
        }
    }

    const setVisible = () => {
        setModalVisible(!modalVisible)
    }


    return (
        <QuoteProvider>
            <View style={styles.quotes_container}>
                {/*********************** Modal *************************/}
                <QuoteModal currentQuote={currentQuote} modalVisible={modalVisible} setVisible={setVisible}/>

                {/*********************** Title *************************/}
                <View style={styles.title_container}>
                        <View style={{ flex: .3, marginTop: '9%', marginLeft: '8%' }}>
                            <Pressable onPress={() => setModalVisible(true)}>
                                {/* Only render the Image component if the URL is a non-empty string */}
                                    {currentQuote.img_links[imageUriIndex] ? (
                                    <Image
                                        style={{ width: 75, height: 75, borderRadius: 35 }}
                                        source={{ uri: currentQuote.img_links[imageUriIndex] }}
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
                            <Text style={[styles.text, {fontSize: 18}]}>{currentQuote.name}</Text>
                            <Text style={[styles.text, {marginTop: '5%'} ]}>{currentQuote.anime}</Text>
                        </View>
                </View>

                {/********************** Quotes **************************/}
                
                <View style={styles.quotes}>
                    {/* FULL SWIPE AREA */}
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

                <QuoteButtons wikiLink={currentQuote.wiki} quote={currentQuote.quote} name={currentQuote.name}/>

            </View>
        </QuoteProvider>
    );
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

