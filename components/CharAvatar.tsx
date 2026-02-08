import { Image } from "expo-image";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';

const screenDimesions = Dimensions.get('screen').width;

const CharAvatar = ({item, onPress} : { item: any, onPress: (item: any) => void}) => {    
   
    return (
        <Pressable onPress={onPress} style={styles.avatar_btn}>
            <Image 
                style={styles.avatar_image}
                source={{
                    uri: item.img_links[0]
                }}
                contentFit="cover"
                contentPosition={"center"}
                cachePolicy="memory-disk"
            />
            <Text style={styles.avatar_text}>{item.name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    avatar_container: {
        width: 125,
        height: 125,
        borderRadius: 62.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar_image: {
        width: screenDimesions * .20, 
        height: screenDimesions * .20, 
        borderRadius: 62.5
    },
    avatar_text: { 
        marginTop: '10%', 
        paddingBottom: '2%', 
        color: 'white', 
        width: screenDimesions * .25, 
        textAlign: 'center'
    },
    avatar_btn: { 
        width: 'auto', 
        alignItems: 'center', 
        justifyContent: 'center' 
    }
})


export default React.memo(CharAvatar);