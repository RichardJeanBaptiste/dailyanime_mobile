import CharAvatar from '@/components/CharAvatar';
import { QuoteLogItem } from '@/components/Interfaces';
import { QuoteProvider, useSearchContext } from '@/components/QuoteContext';
import QuoteModal from '@/components/QuoteModal';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Characters(){

    const GetChars = () => {

        //const [ chars, setChars ] = useState<any>([]);

        const {charJson, isCharLoading} = useSearchContext();

        const [selectedChar, setSelectedChar] = useState<QuoteLogItem | {}>({});

        const [ modalVisible, setModalVisible ] = useState(false);
        
        const setVisible = () => {
            setModalVisible(!modalVisible)
        }

        const handleOpenModal = (item: any) => {
            console.log(item.name);
            setSelectedChar(item);
            setModalVisible(true);
        }


        
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <QuoteModal currentQuote={selectedChar} modalVisible={modalVisible} setVisible={setVisible}/>

                <FlatList
                    data={charJson}
                    numColumns={3}
                    contentContainerStyle={{ 
                        paddingHorizontal: 10, 
                        paddingBottom: 30,
                        width: '100%', 
                    }}

                    initialNumToRender={12}
                    maxToRenderPerBatch={9}
                    updateCellsBatchingPeriod={50}
                    windowSize={5}
                    columnWrapperStyle={{ 
                        gap: 16, 
                        justifyContent: 'space-between' 
                    }}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({item}) => {
                        return (
                            <CharAvatar 
                                item={item} 
                                onPress={() => handleOpenModal(item)}
                            />
                        )
                    }}
                    keyExtractor={(item) => item.charid}
                    ListEmptyComponent={<Text style={{ color: 'white', fontSize: 24 }}>Characters Loading</Text>}
                />
            </SafeAreaView>
        )
        
    }


    return (
        <QuoteProvider>
            <View style={{ flex: 1, backgroundColor: '#25292e' }}>
                <GetChars />
            </View>
        </QuoteProvider> 
    )
}


