import QuoteButtons from "@/components/QuoteButtons";
import { QuoteProvider, useSearchContext } from "@/components/QuoteContext";
import QuoteModal from "@/components/QuoteModal";
import { Image } from "expo-image";
import { MotiView } from 'moti';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from "react-native";
import { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Daily() {

    const QuoteItem = memo(({item, index, scrollX, setActive, vTest}: {item: any, index: any, scrollX: any, setActive: any, vTest: any}) => {

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
                    { width: SCREEN_WIDTH, height: 400, alignItems: 'center'},
                    animatedStyle
                ]}
            >
                <View style={{ width: '50%' }}>
                    <Pressable onPress={setActive}>
                        <Image
                            style={{ width: 75, height: 75, borderRadius: 35 }}
                            source={{ uri: item?.img_links[0] }}
                            cachePolicy="memory-disk"
                            contentFit="fill"
                            contentPosition={"bottom left"}
                        />
                    </Pressable>
                    
                    <Text style={{ color: 'white',  fontSize: 20, height: 200 }}>{item?.quote}</Text>
                    <QuoteButtons wikiLink={item?.wiki} quote={item?.quote} name={item?.name}/>
                </View>
            </MotiView>
        )
    });

    const TestQuotes = () => {
        const { jsonData, isLoading } = useSearchContext();

        const windowSize = 5;

        const halfWindow = Math.floor(windowSize / 2);

        const [currentIndex, setCurrentIndex] = useState(0);

        const visibleData = useMemo(() => {
            const start = Math.max(0, currentIndex -  halfWindow);
            const end = Math.min(jsonData.length, currentIndex + halfWindow + 1);

            return jsonData.slice(start, end).map((item: any, i: number) => ({
                ...item, 
                originalIndex: start + i,
            }));
        
        }, [currentIndex, jsonData]);

        const vTest = () => {
            const start = Math.max(0, currentIndex -  halfWindow);
            const end = Math.min(jsonData.length, currentIndex + halfWindow + 1);

            let x = jsonData.slice(start, end).map((item: any, i: number) => ({
                ...item, 
                "key": start + i
            }));

            console.log(x);
        }

        const handleMomentumScrollEnd = (event: any) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const indexInWindow = Math.round(offsetX / SCREEN_WIDTH);
            const newIndex = visibleData[indexInWindow]?.originalIndex;

            if (newIndex !== undefined && newIndex !== currentIndex) {
                // 1. Update the state to shift the window
                setCurrentIndex(newIndex);

                // 2. IMMEDIATELY snap the scroll position to the new "center"
                // Since we are centering the window around 'newIndex', 
                // the item at 'newIndex' will now be at index 'halfWindow' in the new array.
                listRef.current?.scrollToIndex({
                    index: halfWindow,
                    animated: false,
                });
            }
        };

        const listRef = useRef<FlatList>(null);

        useEffect(() => {
            // Check if the list has items and if the index is valid
            if (jsonData && jsonData.length > 0 && halfWindow < jsonData.length) {
                listRef.current?.scrollToIndex({
                    index: halfWindow,
                    animated: false
                });
            }
        }, [jsonData, halfWindow]); 


        const scrollX = useSharedValue(0);

        const onScroll = (event: any) => {
            scrollX.value = event.nativeEvent.contentOffset.x;
        }

        const [ activeQuote, setActiveQuote ] = useState({
            name: '',
            anime: '',
            biography: '',
            img_links: []
        });

        const [ modalVisible, setModalVisible ] = useState(false);

        const setVisible = () => {
            setModalVisible(!modalVisible);
        }

        const setActive = useCallback((item: any) => {
            let x = {
                name: item?.char_name,
                anime: item?.anime,
                biography: item?.biography,
                img_links: item?.img_links
            }

            setActiveQuote(x);
            setModalVisible(!modalVisible);
        },[]);


        

        return (
            <View style={{flex: 1}}>
                <QuoteModal currentQuote={activeQuote} modalVisible={modalVisible} setVisible={setVisible}/>

                <FlatList
                    ref={listRef}
                    data={visibleData}
                    pagingEnabled
                    horizontal
                    windowSize={3}
                    maxToRenderPerBatch={3}
                    removeClippedSubviews
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    initialNumToRender={3}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    renderItem={({item, index}) => <QuoteItem item={item} index={index} scrollX={scrollX} setActive={() => setActive(item)} vTest={vTest}/>}
                    getItemLayout={(data, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                    })}
                    keyExtractor={(item) => item.originalIndex.toString()}
                    ListEmptyComponent={<Text>Empty List</Text>}
                />
            </View>
        )
    }

    
    return (
        <QuoteProvider>
            <View style={{ flex: 1 , backgroundColor: '#25292e'}}>
                <TestQuotes/>
            </View>
        </QuoteProvider>
    )
}