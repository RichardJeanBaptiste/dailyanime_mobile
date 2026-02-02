import { Image } from "expo-image";
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { QuoteLogItem } from "./Interfaces";
import { shuffleArray } from './methods';
import QuoteButtons from "./QuoteButtons";
import { useSearchContext } from './QuoteContext';
import QuoteModal from "./QuoteModal";

const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;  

export default function Quotes() {

    const { jsonData, isLoading, subQuote, isSubClicked } = useSearchContext();

    const [imageUriIndex, setImageUriIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);

    const [data, setAppData] = useState<QuoteLogItem[]>([]);

    const [quoteLog, setQuoteLog] = useState<number[]>([]);

    const [displayIndex, setDisplayIndex] = useState(-1);

    const currentIndex = quoteLog[displayIndex];
    const currentQuote = currentIndex !== undefined ? data[currentIndex]: null; 


    // Load JSON Data
    useEffect(() => {

        if(!isLoading && jsonData) {
            
            setAppData(jsonData);

            const indices = Array.from({ length: jsonData.length }, (_, i) => i);

            const randomizedIndicies = shuffleArray(indices);

            setQuoteLog(randomizedIndicies);

            setDisplayIndex(0);
        }
        
    },[isLoading, jsonData]);


    const changeDataLog = () => {

        let x = [...quoteLog];

        x.map((index) => {
            if(data[index].quote === subQuote.quote) {
                //console.log("Current Index: ", index);
                //console.log("Current Quote at Index: ", data[index].quote)

                setAppData((prevData) => {

                    let newData = [...prevData];

                    newData[index].char_name = subQuote.char_name;
                    newData[index].anime = subQuote.anime;
                    newData[index].img_links = subQuote.img_links;
                    newData[index].biography = subQuote.biography;
                    newData[index].wiki = subQuote.wiki;

                    return newData;
                })

                setQuoteLog(prevLog => {

                    let x = [...prevLog];

                    x[0] = index;

                    return x;
                });

                return;
            }
        });

        setDisplayIndex(prevIndex => {
            return 0;
        });
    }

    useEffect(() => {
        if(isSubClicked) {
            changeDataLog();
        }
    },[isSubClicked]);


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

        console.log(`Image Error: ${currentQuote?.img_links[imageUriIndex]}`)

        setImageUriIndex( imageUriIndex + 1 )

        setImageUriIndex( prevIndex => {
            const newIndex = prevIndex + 1;

            return newIndex;
        })

        if(imageUriIndex > currentQuote?.img_links.length) {
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
                            name: currentQuote?.char_name,
                            anime: currentQuote?.anime,
                            img_links: currentQuote?.img_links,
                            biography: currentQuote?.biography,
                            wiki: currentQuote?.wiki
                        }} 
                        modalVisible={modalVisible} 
                        setVisible={setVisible}
                    />

                    {/*************************** Title *****************************/}
                    <View style={styles.title_container}>
                            <View style={{ flex: .3, marginTop: '9%', marginLeft: '8%' }}>
                                <Pressable onPress={() => setModalVisible(true)}>
                                    {/* Only render the Image component if the URL is a non-empty string */}
                                        {currentQuote?.img_links[imageUriIndex] ? (
                                            
                                        <Image
                                            style={{ width: 75, height: 75, borderRadius: 35 }}
                                            source={{ uri: currentQuote?.img_links[imageUriIndex] }}
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
                                <Text style={[styles.text, {fontSize: 18}]}>{currentQuote?.char_name}</Text>
                                <Text style={[styles.text, {marginTop: '5%'} ]}>{currentQuote?.anime || ''}</Text>
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
                                    <Text style={{ color: 'white', width: '100%',fontSize: 24}} >{currentQuote?.quote}</Text>
                                </View>
                            </View>
                    </View>

                    {/********************** Quote Buttons ******************/}

                    <QuoteButtons wikiLink={currentQuote?.wiki || ''} quote={currentQuote?.quote || ''} name={currentQuote?.char_name || ''}/>

                </View>
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

