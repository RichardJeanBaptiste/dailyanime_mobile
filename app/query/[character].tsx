import { QuoteLogItem } from '@/components/Interfaces';
import QuoteButtons from '@/components/QuoteButtons';
import { supabase } from '@/utils';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';


const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH; 

export default function CharQuery() {
    
    const { character } = useLocalSearchParams();

    const [imageUriIndex, setImageUriIndex] = useState(0);

    const [ quoteLog, setQuoteLog ] = useState<any>([]);

    const [logIndex, setLogIndex] = useState(0);

    const [currentQuote, setCurrentQuote] = useState<QuoteLogItem>({
        name: '',
        anime: '',
        img_links: [],
        quote: '',
        biography: '',
        wiki: ''
    });


    useEffect(() => {

        if(quoteLog.length != 0) {
           
            setCurrentQuote({
                name: quoteLog[logIndex].name || '',
                anime: quoteLog[logIndex].anime || '',
                img_links: quoteLog[logIndex].img_links || 'https://img.freepik.com/free-photo/anime-style-illustration-rose_23-2151548355.jpg',
                quote: quoteLog[logIndex].quote || '',
                biography: quoteLog[logIndex].biography || '',
                wiki: quoteLog[logIndex].wiki || ''
            });
        }
        
        
    },[logIndex]);


    useFocusEffect(
        useCallback(() => {
            setLogIndex(0)
            getQuotes();
        },[character])
    )

    
    const getQuotes = async () => {

        const { data, error } = await supabase.rpc('get_char_quotes', { 
            p_char_name: character 
        });

        if (error) {
            console.log(`Error fetching data from character:\n`)
            console.error(error);
        }
        
        //console.log(data);
        setQuoteLog(data);

        if(data !== null) {
            setCurrentQuote({
                name: data[0].name || '',
                anime: data[0].anime || '',
                img_links: data[0].img_links || 'https://img.freepik.com/free-photo/anime-style-illustration-rose_23-2151548355.jpg',
                quote: data[0].quote || '',
                biography: data[0].biography || '',
                wiki: data[0].wiki || ''
            });
        }
        
    }

    const cycleImages = () => {

        console.log(`Image Error: ${currentQuote.img_links[imageUriIndex]}`)

        setImageUriIndex( imageUriIndex + 1)

        if(imageUriIndex > currentQuote.img_links.length) {
            console.log("No Images");
        }
    }



    const panResponder = useMemo(() => {
    
            const nextQuote = () => {
                let index = logIndex + 1;

                if(index >= quoteLog.length) {
                    console.log("End of array")
                    return
                } else {
                    setLogIndex(index);
                }
            }
    
            const prevQuote = () => {
                let index = logIndex - 1;

                if(index <= 0) {
                    console.log("Start of Array")
                    return
                } else {
                    setLogIndex(index);
                } 
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
                            prevQuote();
                        } else {
                            //console.log("Right Swipe");
                            nextQuote();
                        }
                    }
                }
            });
    
        }, [logIndex, quoteLog]);



    return (
        <View style={styles.quotes_container}>
            
            {/*********************** Title *************************/}

            <View style={styles.title_container}>
                <Image
                    style={{ width: 100, height: 100, borderRadius: 50}}
                    source={{
                        uri: currentQuote.img_links[0]
                    }}
                />

                <Text onPress={() => console.log(currentQuote)} style={styles.char_text}>{character}</Text>
            </View>
            

            {/********************************** Quotes *****************************************/}

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
                            <Text style={styles.quote_text}>{currentQuote.quote}</Text>
                        </View>
                    </View>
            </View>

            {/*********************************** Quote Buttons *********************************/}

            <QuoteButtons wikiLink={currentQuote.wiki} quote={currentQuote.quote} name={character.toLocaleString()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    quotes_container: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#25292e'
    },
    quotes: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title_container: {
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '25%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    char_text: {
        color: 'white',
        fontSize: 28,
        marginTop: '2%',
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline'
    },
    quote_text: {
        color: 'white',
        width: '100%',
        fontSize: 24
    }

})

