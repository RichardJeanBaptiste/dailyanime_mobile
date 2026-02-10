import IconButton from '@/components/IconButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Key, useCallback, useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Bookmarks(){

    const [ savedQuotes, setSavedQuotes ] = useState<any>([]);

    useEffect(() => {
       getSavedQuotes();
    },[]);

    useFocusEffect(
        useCallback(() => {
            getSavedQuotes();
        },[])
    );

    const getSavedQuotes = async () => {
        let value = await AsyncStorage.getItem('quotes');

        if(value == null) {
            return
        }

        setSavedQuotes(JSON.parse(value))
    }

    const deleteBookmark = async (quote: string) => {
        
        let value = await AsyncStorage.getItem('quotes');

        if(value == null) {
            return
        }

        let quotes = JSON.parse(value);

        let x = quotes.filter((x: any) => x.quote !== quote);

        await AsyncStorage.setItem("quotes", JSON.stringify(x));

        setSavedQuotes(x);
    }

    const shareBookmark = async (quote: string, name: string) => {
        
        try {
            const result = await Share.share({
                message: `${quote} - ${name}`,
            });

            console.log(result)
        } catch (error) {
            console.log(error)
            alert("Something went wrong when sharing?")
        }
    }

    const BookmarkItem = ({quote ,author} : {quote: string, author: string}) => {
        return (
            <View style={styles.bookmark_border}>
                <Text style={styles.bookmark_text}>{`${quote}\n\n-${author}`}</Text>
                <View style={styles.bookmark_btn_container}>
                    <View style={styles.delete_btn}>
                        <IconButton icon={<FontAwesome name="trash" size={20} color="white" />} onPress={() => deleteBookmark(quote)}/>
                    </View>
                    
                    <View style={styles.share_btn}>
                        <IconButton icon={<FontAwesome name="share" size={20} color="white" />} onPress={() => shareBookmark(quote, author)}/>
                    </View>
                    
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor:'#25292e' }} edges={['right', 'bottom', 'left']}>
            {/** Put title here later */}
            <View style={{ width: '100%', height: '8%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' , fontSize: 18 }}>Bookmarks</Text>
            </View>
            
            <ScrollView 
                style={styles.s_root}
                contentContainerStyle={{
                    paddingBottom: '15%'
                }}
            >
                {savedQuotes?.map((item : {author: string, quote: string}, index : Key) => {
                    return ( 
                        <BookmarkItem key={index} quote={item.quote} author={item.author}/>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    s_root: {
        width: '100%',
        height: '85%'
    },
    bookmark_border: {
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderColor: 'orange', 
        borderTopWidth: 0, 
        borderLeftWidth: 0, 
        borderRightWidth: 0, 
        width:'100%', 
        height: 'auto', 
        paddingBottom: 20, 
        marginTop: '2%', 
        flexDirection: 'row'
    },
    bookmark_text: {
        color: 'white', 
        flex :.95, 
        fontSize: 18 
    },
    bookmark_btn_container: {
        display: 'flex', 
        flexDirection: 'column', 
        flex: .1, 
        height: '100%', 
        position: 'relative'
    },
    delete_btn: {
        position: 'absolute', 
        top: '15%', 
        left: '25%'
    },
    share_btn: { 
        position: 'absolute', 
        top: '60%', 
        left: '25%' 
    }
})
