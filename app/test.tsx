import * as RNFS from '@dr.pogodin/react-native-fs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, View } from 'react-native';
//import { AppOpenAd, BannerAd, BannerAdSize, TestIds, useForeground, useInterstitialAd } from 'react-native-google-mobile-ads';
import QuoteCard from '@/components/Quotes/QuoteCard';
import { useSearchContext } from '@/components/Quotes/QuoteContext';
import useAppConstants from '@/hooks/useAppConstants';


const { SCREEN_WIDTH, SCREEN_HEIGHT } = useAppConstants();



const queryClient = new QueryClient();
const filePath = `${RNFS.DocumentDirectoryPath}/quotes.json`;

const testQuote = {
    id: 1,
    quote: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu eleifend orci, quis suscipit enim. `,
    char_name: "Itachi",
    anime: "Naruto",
    biography: "emo edgelord nigga"
}



function Example() {
    
    const { jsonData } = useSearchContext();
    const [ currentIndex, setCurrentIndex] = useState(0);

    
    
    return (
        <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'relative' }} >
            <View style={{ width: '95%' , height: '70%', position: 'absolute', top: '37%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <QuoteCard quote={jsonData[currentIndex]}  />
            </View>

            <Text onPress={() => setCurrentIndex((prev) => prev + 1)}>Next Quote</Text>
        </View>
    )
}

// export type Quote = {
//   id: string | number;
//   quote: string;
//   char_name: string;
//   anime: string;
//   biography: string;
//   episode?: string | number;
//   imageUrl?: string;
// };

export default function TestStuff() {

    return (
        <QueryClientProvider client={queryClient}>
            <Example/>
        </QueryClientProvider> 
    )
}
