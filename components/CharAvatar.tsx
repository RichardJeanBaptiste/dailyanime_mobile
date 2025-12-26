import { Image } from "expo-image";
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { QuoteProvider } from "./QuoteContext";
import QuoteModal from './QuoteModal';


const screenDimesions = Dimensions.get('screen').width;

export default function CharAvatar({name, item} : {name: string, item: any}){
    
    const [ modalVisible, setModalVisible ] = useState(false);

    const setVisible = () => {
        setModalVisible(!modalVisible)
    }


    return (
        <QuoteProvider>
            <View>
                <QuoteModal currentQuote={item} modalVisible={modalVisible} setVisible={setVisible}/>
                <Pressable onPress={setVisible} style={{ width: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                    <Image 
                        style={{ width: screenDimesions * .25, height: screenDimesions * .25, borderRadius: 62.5 }}
                        source={{
                            uri: item.img_links[0]
                        }}
                        contentFit="cover"
                        contentPosition={"center"}
                    />
                    <Text style={{ marginTop: '10%', paddingBottom: '2%', color: 'white'}}>{item.name}</Text>
                </Pressable>
            </View>
        </QuoteProvider>
    )
}

const styles = StyleSheet.create({
    avatar_container: {
        width: 125,
        height: 125,
        borderRadius: 62.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})