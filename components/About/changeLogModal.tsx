import changeLogData from '@/changelog.json';
import useAppConstants from '@/hooks/useAppConstants';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface LogItem {
    version : string,
    releaseDate: string,
    type: string,
    highlights: Highlight[]
}

interface Highlight extends Array<Highlight> {
    category: string,
    title: string,
    description: string,
    navigateTo: string
}

export default function ChangeLogModal({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {

    // useEffect(() => {
    //     console.log(changeLogData);

    //     changeLogData.map((x) => {
    //         console.log(x.version)

    //         x.highlights.map((y) => {
    //             console.log(y)
    //         })
    //     })
    // },[])

    const { SCREEN_WIDTH, SCREEN_HEIGHT } = useAppConstants(); 

    const LogItem = ({version, releaseDate, type, highlights}: LogItem) => {

        const catColor = (x: string) => {
            switch(x) {
                case 'New':
                    return 'green'
                case 'Fixed':
                    return 'red'
                case 'Improved':
                    return 'lightblue'
                default:
                    return 'white' 
            }
        }

        return (
            <View style={{ width: '100%', height: 'auto', borderBottomColor: 'white', borderBottomWidth: 1}}>

                <View style={{display: 'flex', flexDirection: 'row', width: 'auto', height: '5%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: '3%'}}>
                    <Text style={styles.modalText}>{version}</Text>
                    <Text style={styles.modalText}>{releaseDate}</Text>
                </View>
                
                <View style={{ marginTop: '2%'}}>
                    {highlights.map((item,key) => {
                        return (
                            <View style={{ paddingHorizontal: 10 }} key={key}>
                                <Text style={[styles.modalText, {color: catColor(item.category)}]}>{item.category}</Text>
                                <Text style={[styles.modalText]}>{item.title}</Text>
                                <Text style={[styles.modalText]}>{item.description}</Text>
                                <Text style={[styles.modalText]}>{item.navigateTo}</Text>
                            </View>
                        )
                    })}
                </View>
                
            </View>
        )
    }

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setVisible();
                }}
            >
                <View style={[styles.centeredView]}>
                    <View style={[styles.modalView, {width: SCREEN_WIDTH * .8 , height: SCREEN_HEIGHT * .7 }]}>
                        <Text style={[styles.modalText, {fontWeight: 'bold', fontSize: 20, textDecorationLine: 'underline' }]}>Change Logs</Text>
                        <View style={{ width: SCREEN_WIDTH * .8, height: '85%'}}>
                                <ScrollView
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{
                                        alignItems: 'center',
                                    }}
                                >
                                    {changeLogData?.map((item,key) => {
                                        return (
                                            <LogItem version={item.version} releaseDate={item.releaseDate} type={item.type} highlights={item.highlights as Highlight} key={key}/>
                                        )
                                    })}

                                </ScrollView>
                        </View>
                        
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setVisible()}>
                                <Text style={styles.textStyle}>Close </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
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
    backgroundColor: '#25292e',
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
    color: 'white'
  },

});