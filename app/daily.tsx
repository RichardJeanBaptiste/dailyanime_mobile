import { QuoteProvider, useSearchContext } from "@/components/QuoteContext";
import { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Daily() {

    const Daily = () => {

        const { dailyQuote } = useSearchContext();

        useEffect(() => {
            console.log(dailyQuote);
        },[]);


        return (
            <View style={{ flex: 1 , backgroundColor: '#25292e', gap:20 }}>
                <Text style={{ color: 'white'}}>Daily</Text>
            </View>
        )
    }

    
    return (
        <QuoteProvider>
            <Daily/>
        </QuoteProvider>
    )
}
