import QuoteButtons from "@/components/Quotes/QuoteButtons";
import { useSearchContext } from "@/components/Quotes/QuoteContext";
import QuoteModal from "@/components/Quotes/QuoteModal";
import useAppConstants from "@/hooks/useAppConstants";
import { supabase } from "@/utils";
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from "react-native";


export default function Daily() {

    const { dailyQuote, updateDailyQuote } = useSearchContext();

    const { SCREEN_WIDTH } = useAppConstants();

    const [ modalVisible, setModalVisible ] = useState(false);

    const setVisible = () => {
        setModalVisible(!modalVisible);
    }

    useEffect(() => {
        if(dailyQuote?.quote == undefined) {
            console.log("Quote Undefined");
            getQuote();
        }
    },[]);

    const getQuote = async () => {

        const { data , error } = await supabase.rpc('get_quotes_json');

        if(error) {
            console.error("Error getting daily quote from getQuote: ", error);
        }

        const randomIndex = Math.floor(Math.random() * (data.length || 100));

        let quote = await data[randomIndex];

        updateDailyQuote(quote);
    }

    if(dailyQuote?.quote) {
        return (
            <View style={{ flex: 1 , backgroundColor: '#25292e', gap:20, justifyContent: 'center', alignItems: 'center'}}>

                <View style={{ height: '1%'}}>
                    <QuoteModal currentQuote={dailyQuote} modalVisible={modalVisible} setVisible={setVisible}/>
                </View>
                
                
                <Pressable onPress={setVisible}>
                    <Image
                        style={{ width: 130, height: 130, borderRadius: 65 }}
                        source={{ uri: dailyQuote?.img_links?.[0] }}
                        cachePolicy="memory-disk"
                        contentFit="fill"
                        contentPosition={"bottom left"}
                    />
                </Pressable>
                
                <Text style={{ color: 'white', fontSize: 24, textDecorationLine: 'underline' }} >{dailyQuote?.char_name}</Text>
                <Text style={{ color: 'white', fontSize: 22, width: SCREEN_WIDTH * .8 }} onPress={() => console.log(dailyQuote?.quote)}>{dailyQuote?.quote || ""}</Text>

                <QuoteButtons wikiLink={dailyQuote?.wiki} quote={dailyQuote?.quote} name={dailyQuote?.char_name} />
            </View>   
        )
    } else {
        return (
            <View style={{ flex: 1 , backgroundColor: '#25292e' }} ></View>
        )
    }
}
