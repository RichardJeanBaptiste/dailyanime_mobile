import * as RNFS from '@dr.pogodin/react-native-fs';
import { Image } from "expo-image";
import * as Notifications from 'expo-notifications';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { QuoteLogItem2 } from "./Interfaces";
import QuoteButtons from "./QuoteButtons";
import { QuoteProvider } from "./QuoteContext";
import QuoteModal from "./QuoteModal";

const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;  

export default function Quotes() {

    const [imageUriIndex, setImageUriIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);

    const [data, setAppData] = useState<QuoteLogItem2[]>([]);

    const [displayIndex, setDisplayIndex] = useState(0);

    const [currentQuote, setCurrentQuote] = useState({
        name: data?.[displayIndex]?.char_name ,
        anime: data?.[displayIndex]?.anime || '',
        img_links: data?.[displayIndex]?.img_links || [],
        quote: data?.[displayIndex]?.quote || '',
        biography: data?.[displayIndex]?.biography || '',
        wiki: data?.[displayIndex]?.wiki || ''
    });

    const [ quoteLog, setQuoteLog ] = useState<Number[]>([]);

    const loadJsonFile = async () => {
        const filePath = `${RNFS.DocumentDirectoryPath}/user_data.json`;
    try {
      const exists = await RNFS.exists(filePath);
      
      if (exists) {
        // 2. Read the file as a string
        const content = await RNFS.readFile(filePath, 'utf8');
        
        const jsonObject = JSON.parse(JSON.parse(content));
        
        setAppData(jsonObject);

        const randomIndex = Math.floor(Math.random() * (jsonObject.length - 0 + 1)) + 0;

        console.log(randomIndex);

        console.log('Data loaded successfully');
      } else {
        console.log('No saved file found');
      }
    } catch (error) {
        console.error('Error reading file:', error);
    }
  };


    useEffect(() => {


        loadJsonFile();
        
        const getSubQuote = async () => {
          
            let x = {
                name: data?.[displayIndex]?.char_name ,
                anime: data?.[displayIndex]?.anime || '',
                img_links: data?.[displayIndex]?.img_links || [],
                quote: data?.[displayIndex]?.quote || '',
                biography: data?.[displayIndex]?.biography || '',
                wiki: data?.[displayIndex]?.wiki || ''
            }

            //setQuoteLog((prevLog) => [x, ...prevLog]);

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

    

    const panResponder = useMemo(() => {

        const nextQuote = () => {

            setDisplayIndex(prevIndex => {
                const nextIndex = prevIndex + 1;

                if(nextIndex >= data.length) {
                    console.log("End of array");
                    return prevIndex;
                }

                return nextIndex;
            });
        
        }

        const previousQuote = () => {

            setDisplayIndex(prevIndex => {
                
                const nextIndex = prevIndex - 1;

                if( nextIndex < 0) {
                    console.log("Start");
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

    }, [displayIndex]);

  

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

    const pushToFront = () => {
        //setQuoteLog(prevArray => ['new', ...prevArray]);
    }


    return (
        <QuoteProvider>
            <View style={styles.quotes_container}>
                {/*********************** Modal *************************/}
                <QuoteModal 
                    currentQuote={{
                        name: data?.[displayIndex]?.char_name,
                        anime: data?.[displayIndex]?.anime,
                        biography: data?.[displayIndex]?.biography,
                        wiki: data?.[displayIndex]?.wiki,
                        img_links: data?.[displayIndex]?.img_links || []
                    }} 
                    modalVisible={modalVisible} 
                    setVisible={setVisible}
                />

                {/*************************** Title *****************************/}
                <View style={styles.title_container}>
                        <View style={{ flex: .3, marginTop: '9%', marginLeft: '8%' }}>
                            <Pressable onPress={() => setModalVisible(true)}>
                                {/* Only render the Image component if the URL is a non-empty string */}
                                    {data?.[displayIndex]?.img_links[imageUriIndex] ? (
                                    <Image
                                        style={{ width: 75, height: 75, borderRadius: 35 }}
                                        source={{ uri: data?.[displayIndex]?.img_links[imageUriIndex] }}
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
                            <Text style={[styles.text, {fontSize: 18}]}>{data?.[displayIndex]?.char_name || ''}</Text>
                            <Text style={[styles.text, {marginTop: '5%'} ]}>{data?.[displayIndex]?.anime || ''}</Text>
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
                                <Text style={{ color: 'white', width: '100%',fontSize: 24}}>{data?.[displayIndex]?.quote || ''}</Text>
                            </View>
                        </View>
                </View>

                {/********************** Quote Buttons ******************/}

                    <Text style={{ color: 'white', width: '100%',fontSize: 24, position: 'absolute', top: '25%'}} onPress={pushToFront}>Push to front</Text>            
                    <Text style={{ color: 'white', width: '100%',fontSize: 24, position: 'absolute', top: '20%'}} onPress={() => console.log(quoteLog)}>Show Quote Log</Text>
                    

                <QuoteButtons wikiLink={data?.[displayIndex]?.wiki || ''} quote={data?.[displayIndex]?.quote || ''} name={data?.[displayIndex]?.char_name || ''}/>

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

