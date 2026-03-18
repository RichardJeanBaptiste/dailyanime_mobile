import QuoteCarousel from "@/components/QuoteCarousel";
import { QuoteProvider, useSearchContext } from "@/components/QuoteContext";
import { Dimensions, Text, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Daily() {

    const TestQuotes = () => {

        const { jsonData, isLoading } = useSearchContext();
        

        if(isLoading) {
            return (
                <Text>Quotes Loading</Text>
            )
        } else {
            return (
                <View style={{flex: 1}}>
                    <QuoteCarousel data={jsonData} />
                </View>
            )
        }
    }

    
    return (
        <QuoteProvider>
            <View style={{ flex: 1 , backgroundColor: '#25292e'}}>
                <TestQuotes/>
            </View>
        </QuoteProvider>
    )
}

// const handleMomentumScrollEnd = (event: any) => {
//     const offsetX = event.nativeEvent.contentOffset.x;
//     const indexInWindow = Math.round(offsetX / SCREEN_WIDTH);
//     const newIndex = visibleData[indexInWindow]?.originalIndex;

//     if (newIndex !== undefined && newIndex !== currentIndex) {
//         // 1. Update the state to shift the window
//         setCurrentIndex(newIndex);

//         // 2. IMMEDIATELY snap the scroll position to the new "center"
//         // Since we are centering the window around 'newIndex', 
//         // the item at 'newIndex' will now be at index 'halfWindow' in the new array.
//         listRef.current?.scrollToIndex({
//             index: halfWindow,
//             animated: false,
//         });
//     }
// };