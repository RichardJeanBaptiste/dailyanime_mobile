import { QuoteLogItem } from '@/components/Interfaces';
import QuoteButtons from '@/components/Quotes/QuoteButtons';
import { useSearchContext } from '@/components/Quotes/QuoteContext';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text } from 'react-native';
import { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from 'react-native-safe-area-context';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function CharQuery() {
    
    const { character } = useLocalSearchParams();

    const [imageUriIndex, setImageUriIndex] = useState(0);

    const [ quoteLog, setQuoteLog ] = useState<QuoteLogItem[]>([]);

    const [logIndex, setLogIndex] = useState(0);

    const currentQuote = logIndex !== undefined ? quoteLog[logIndex]: null; 

    const {  getCharQuotes } = useSearchContext();


    useFocusEffect(
        useCallback(() => {
            setLogIndex(0)
            getQuotes();
        },[character])
    )

    
    const getQuotes = async () => {

        let data = await getCharQuotes(character);
        
        setQuoteLog(data);
    }

    const listRef = useRef<FlatList>(null);

    const scrollX = useSharedValue(0);
    
    const onScroll = (event: any) => {
        scrollX.value = event.nativeEvent.contentOffset.x;
    }

    const CharItem = ({item, index}: {item: any, index: any}) => {

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
                transition={{ type: 'spring', delay: index * 90}}
                style={[
                    { display: 'flex', flexDirection: 'column', width: SCREEN_WIDTH, height: SCREEN_HEIGHT, alignItems: 'center',},
                    animatedStyle
                ]}
            >
                <Image
                    style={{ width: 130, height: 130, borderRadius: 65 }}
                    source={{ uri: item?.img_links[imageUriIndex] }}
                    cachePolicy="memory-disk"
                    contentFit="fill"
                    contentPosition={"bottom left"}
                />
                <Text style={{ color: 'white', fontSize: 32, marginTop: '8%'}}>{character}</Text>
                <Text style={{ color: 'white', fontSize: 22, textAlign: 'center', marginTop: '4%', width: '80%'}}>{item.quote}</Text>
                
                <QuoteButtons wikiLink={item?.wiki || ''} quote={item?.quote || ''} name={character.toString()} style={{marginTop: '4%'}}/>
            </MotiView> 
        )
    }

    
    return (
        <SafeAreaView style={styles.quotes_container}>
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
                renderItem={({item, index}) => <CharItem item={item} index={index}/>} 
                keyExtractor={(item, index) => `${item}-${index}`}
                ListEmptyComponent={<Text>Empty List</Text>}      
            />
        </SafeAreaView>
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
        height: '100%',
        textAlign: 'center',
        fontSize: 24
    }
})

