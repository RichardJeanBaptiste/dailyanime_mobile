import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import IconButton from './IconButton';
import { QuoteButtonItem } from './Interfaces';

export default function QuoteButtons({wikiLink, quote, name} : QuoteButtonItem) {

    const [ quoteExists, setQuoteExists ] = useState(false);

    useEffect(() => {
        const checkIfQuoteExists = async () => {
            const value = await AsyncStorage.getItem("quotes");
            
            if(value == null) {
                return;
            }

            let x  = JSON.parse(value);

            x.map((storedQuote: any) => {
                if(storedQuote.quote === quote) {
                    console.log(`Quote Exists - ${quote}`)
                    setQuoteExists(true);
                }
            })
        } 

        setQuoteExists(false);

        checkIfQuoteExists();
    },[ quote ]);
  

    const storeQuote = async () => {
        try {

            const value = await AsyncStorage.getItem('quotes'); 
            let x;

            if(value !== null) {
                x = JSON.parse(value);
            }

            if(quoteExists) {

                let filteredQuotes = x.filter((storedQuote : any) => {
                    return storedQuote.quote !== quote
                })

                await AsyncStorage.setItem("quotes", JSON.stringify(filteredQuotes))

                setQuoteExists(false);

            } else {
                
                if (value == null) {
                    await AsyncStorage.setItem("quotes", JSON.stringify([ {author: name, quote: quote}]))
                } else {

                    x.push({author: name, quote: quote});

                    await AsyncStorage.setItem("quotes", JSON.stringify(x))

                    setQuoteExists(true);
                    console.log("Bookmark Added")

                }
            } 

        } catch (error) {
            console.log(error)
        }
    }

    const linkToWiki = () => {
        Linking.openURL(wikiLink);
    }

    const shareQuote = async () => {
        console.log("Share Quote")
        try {
            const result = await Share.share({
                message: `${quote} - ${name}`,
                title: 'Share Quote'
            });

            console.log(result)
        } catch (error) {
            console.log(error)
            alert("Something went wrong when sharing?")
        }
    }

    const BookmarkItem = () => {
        if(quoteExists) {
            return (
                <FontAwesome name="get-pocket" size={18} color="orange" />
            )
        } else {
            return (
                <FontAwesome name="get-pocket" size={18} color="white" />
            )
        }
    }

    return (
        <View style={styles.btnGroup}>

            <IconButton icon={<BookmarkItem/>} onPress={storeQuote}/>

            <IconButton icon={<FontAwesome name="wikipedia-w" size={18} color="white" />} onPress={linkToWiki}/>
                       
            <IconButton icon={<FontAwesome name="share" size={18} color="white" />} onPress={shareQuote}/>

        </View>   
    )
}

const styles = StyleSheet.create({
    btnGroup : {
        position: 'absolute',
        top: '80%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 45,
        fontSize: 16
    },
})

