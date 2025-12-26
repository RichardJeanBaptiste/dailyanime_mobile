import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import IconButton from './IconButton';
import { useSearchContext } from './QuoteContext';


interface ModalInfo {
    currentQuote: any,
    modalVisible: boolean,
    setVisible: () => void
}


export default function QuoteModal({currentQuote, modalVisible, setVisible}: ModalInfo) {

    const { charQuery  } = useSearchContext();

    const linkToWiki = () => {
        Linking.openURL(currentQuote.wiki);
    }


    const openQuotes = (name: string) => {
        setVisible();

        charQuery(name);

    }



    return (
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setVisible();
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ width: '100%', height: '40%', alignItems: 'center', justifyContent: 'center' }}>
                                <ScrollView
                                    style={{ width: '100%'}}
                                    horizontal={true}
                                    contentContainerStyle={{ paddingRight: '6%'}}
                                >
                                    {currentQuote.img_links.map((img : any, index : any) => {
                                        return (
                                            <View style={{ width: 200, height: 200,  paddingRight: '1.5%', marginRight: '3%', marginLeft: '1.5%'}} key={index}>
                                                <Image
                                                    style= {{ width: '95%', height: "95%"}}
                                                    source={{
                                                        uri: img
                                                    }}
                                                    contentFit="contain"
                                                    contentPosition={"center"}
                                                />
                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                            
                            <ScrollView style={{ width: '100%', height: '10%', paddingBottom: '3%'}}>
                                <Text style={[styles.modalText, {textDecorationLine: 'underline', fontSize: 24}]}>{currentQuote.name}</Text>
                                <Text style={[styles.modalText, {fontSize: 20}]}> Anime: {currentQuote.anime}</Text>

                                <View style={{  width: '100%', paddingBottom: 20 }}>
                                    <Text style={[styles.modalText, {fontSize: 18}]}> {currentQuote.biography}</Text>
                                </View>
                            </ScrollView>          
                                
                                    
                            <View style={{ width: '100%', marginTop: '2%',justifyContent: 'center', alignItems: 'center', gap: 30 , display: 'flex' , flexDirection: 'row'}}>
                                <IconButton icon={<FontAwesome name="wikipedia-w" size={24} color="white"/>} onPress={linkToWiki}/>
                                <IconButton icon={<FontAwesome name="quote-right" size={24} color="white"/>} onPress={() => openQuotes(currentQuote.name)}/>
                                <IconButton icon={<FontAwesome name="close" size={24} color="red" />} onPress={() => setVisible()}/>
                            </View> 
                    
                        </View>
                    </View>
                </Modal>
            </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        width: '80%',
        height: '90%',
        backgroundColor: '#5D6369',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'left',
        color: 'white'
    },
})