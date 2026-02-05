import CharAvatar from '@/components/CharAvatar';
import { QuoteLogItem } from '@/components/Interfaces';
import { QuoteProvider } from '@/components/QuoteContext';
import QuoteModal from '@/components/QuoteModal';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

export default function Characters(){

    const GetChars = () => {

        const [ chars, setChars ] = useState<any>([]);

        const [selectedChar, setSelectedChar] = useState<QuoteLogItem | {}>({});

        const [ modalVisible, setModalVisible ] = useState(false);
        
        const setVisible = () => {
            setModalVisible(!modalVisible)
        }

        const loadCharJson = async () => {
            const filepath = `${RNFS.DocumentDirectoryPath}/characters.json`;
    
            try {
                const exists = await RNFS.exists(filepath);
                if(exists) {
                    const content = await RNFS.readFile(filepath, 'utf8');
                    const jsonObject = JSON.parse(content);

                    if(jsonObject == null || jsonObject == undefined) {
                        console.log("CharJson is null");
                        return;
                    }

                    setChars(jsonObject);
                }
            } catch (error) {
                console.error('Error reading characters.json', error);
            } 
        };

        useEffect(() => {
            loadCharJson();
        },[]);

        const handleOpenModal = (item: any) => {
            console.log(item.name);
            setSelectedChar(item);
            setModalVisible(true);
        }


        return (
            <QuoteProvider>
                <QuoteModal currentQuote={selectedChar} modalVisible={modalVisible} setVisible={setVisible}/>

                <FlatList
                    data={chars}
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
                                name={item.name} 
                                item={item} 
                                setVisible={setVisible}
                                onPress={() => handleOpenModal(item)}
                            />
                        )
                    }}
                    keyExtractor={(item) => item.charid}
                />
            </QuoteProvider>
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



/**
 * const GetChars = () => {
    const [chars, setChars] = useState([]);
    const [selectedChar, setSelectedChar] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenModal = (item) => {
        setSelectedChar(item);
        setModalVisible(true);
    };

    return (
        <QuoteProvider> 
            {/* One modal to rule them all */
//             <QuoteModal 
//                 currentQuote={selectedChar} 
//                 modalVisible={modalVisible} 
//                 setVisible={() => setModalVisible(false)} 
//             />
            
//             <FlatList
//                 data={chars}
//                 renderItem={({item}) => (
//                     <CharAvatar 
//                         item={item} 
//                         onPress={() => handleOpenModal(item)} 
//                     />
//                 )}
//                 // ... rest of props
//             />
//         </QuoteProvider>
//     );
// };
 