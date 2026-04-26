import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { memo, useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuoteLogItem } from '../Interfaces';
import QuoteButtons from './QuoteButtons';
import QuoteModal from './QuoteModal';

const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function QuoteCarousel({data, style}: { data: any , style?: any }) {

    const [ modalVisible, setModalVisible ] = useState(false);

    const [ imageUriIndex, setImageUriIndex ] = useState(0);

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
                            <Text style={{fontSize: 18 , color: 'white'}} onPress={() => console.log(data[0])}>{item?.char_name}</Text>
                            <Text style={{marginTop: '5%', color: 'white'}}>{item?.anime || ''}</Text>       
                        </View>
                    </View>
                
                <View style={{ position: 'absolute', top: '25%',  width: '100%', height: '40%', alignItems: 'center', justifyContent: 'center',}}>
                    <Text style={{ color: 'white', fontSize: 24, textAlign: 'center', width:'75%'}}>{item?.quote}</Text>
                </View>

                {/********************** Quote Buttons ******************/}
                <View style={{ position: 'absolute', top: '65%', height: '10%', width: '100%'}}>
                    <QuoteButtons wikiLink={item?.wiki || ''} quote={item?.quote || ''} name={item?.char_name || ''}/>
                </View>
            </MotiView>
        )
    });

    return (
        <SafeAreaView style={[styles.container, style]}>
            <QuoteModal currentQuote={activeQuote} modalVisible={modalVisible} setVisible={setVisible}/>

            <FlatList
                ref={listRef}
                data={data}
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
                renderItem={({item, index}) => <QuoteItem item={item} index={index} scrollX={scrollX} setActive={() => setActive(item)}/>} 
                keyExtractor={(item, index) => `${item}-${index}`}
                ListEmptyComponent={<Text>Empty List</Text>}      
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})