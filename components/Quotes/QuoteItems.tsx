import useAppConstants from '@/hooks/useAppConstants';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { QuoteLogItem } from '../Interfaces';
import QuoteButtons from './QuoteButtons';


const QuoteItem = memo(({item, index, scrollX, setActive}: {item: QuoteLogItem, index: number, scrollX: any, setActive: any}) => {

    const { SCREEN_WIDTH, SCREEN_HEIGHT, PlaceholderImage } = useAppConstants();
 
    const [ imageUriIndex, setImageUriIndex ] = useState(0);

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
                    <View style={styles.titleContainer}>
                        <View style={styles.imgContainer}>
                            <Pressable onPress={setActive}>
                                {/* Only render the Image component if the URL is a non-empty string */}
                                    {item?.img_links[imageUriIndex] ? (
                                        
                                    <Image
                                        style={styles.title_img}
                                        source={{ uri: item?.img_links[imageUriIndex] }}
                                        cachePolicy="memory-disk"
                                        contentFit="fill"
                                        contentPosition={"bottom left"}
                                    />
                                ) : (

                                    <Image
                                        style={styles.title_img}
                                        source={PlaceholderImage}
                                    />
                                )}
                            </Pressable>
                        </View>

                        <View style={styles.title}>
                            <Text style={{fontSize: 18, color: 'white'}}>{item?.char_name}</Text>
                            <Text style={{marginTop: '5%', color: 'white' }}>{item?.anime || ''}</Text>       
                        </View>
                    </View>
                
                <View style={styles.quoteContainer}>
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

const styles = StyleSheet.create({
    titleContainer: {
        width: '100%', 
        height: '30%',
        position: 'absolute', 
        top: '2%', 
        display: 'flex', 
        flexDirection: 'row'
    },
    imgContainer: {
        flex: .3, 
        marginTop: '9%', 
        marginLeft: '8%'
    },
    title_img: {
        width: 75, 
        height: 75, 
        borderRadius: 35
    },
    title: {
        flex: .7, 
        display: 'flex', 
        flexDirection: 'column',
        marginTop: '10%', 
        marginLeft: '4%'
    },
    quoteContainer: {
        position: 'absolute',
        top: '25%',  
        width: '100%', 
        height: '40%', 
        alignItems: 'center', 
        justifyContent: 'center'
    }
})

export default QuoteItem;