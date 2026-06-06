import changeLogData from '@/changelog.json';
import useAppConstants from '@/hooks/useAppConstants';
import { useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ChangeLogModal({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {

    useEffect(() => {
        console.log(changeLogData);

        changeLogData.map((x) => {
            console.log(x.version)

            x.highlights.map((y) => {
                console.log(y)
            })
        })
    },[])

    const { SCREEN_WIDTH, SCREEN_HEIGHT } = useAppConstants(); 

    const LogItem = () => {
        return (
            <Text>Log Item</Text>
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
                        <Text style={styles.modalText}>Change Logs</Text>
                        <LogItem/>
                        <View style={{ backgroundColor: 'pink', width: SCREEN_WIDTH * .8, height: '80%'}}>
                                <ScrollView
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontSize: 24 }}>a</Text>
                                    <Text style={{ fontSize: 24 }}>b</Text>
                                    <Text style={{ fontSize: 24 }}>c</Text>
                                    <Text style={{ fontSize: 24 }}>d</Text>
                                    <Text style={{ fontSize: 24 }}>e</Text>
                                    <Text style={{ fontSize: 24 }}>f</Text>
                                    <Text style={{ fontSize: 24 }}>g</Text>
                                    <Text style={{ fontSize: 24 }}>a</Text>
                                    <Text style={{ fontSize: 24 }}>b</Text>
                                    <Text style={{ fontSize: 24 }}>c</Text>
                                    <Text style={{ fontSize: 24 }}>d</Text>
                                    <Text style={{ fontSize: 24 }}>e</Text>
                                    <Text style={{ fontSize: 24 }}>f</Text>
                                    <Text style={{ fontSize: 24 }}>g</Text>
                                    <Text style={{ fontSize: 24 }}>a</Text>
                                    <Text style={{ fontSize: 24 }}>b</Text>
                                    <Text style={{ fontSize: 24 }}>c</Text>
                                    <Text style={{ fontSize: 24 }}>d</Text>
                                    <Text style={{ fontSize: 24 }}>e</Text>
                                    <Text style={{ fontSize: 24 }}>f</Text>
                                    <Text style={{ fontSize: 24 }}>g</Text>
                                    <Text style={{ fontSize: 24 }}>a</Text>
                                    <Text style={{ fontSize: 24 }}>b</Text>
                                    <Text style={{ fontSize: 24 }}>c</Text>
                                    <Text style={{ fontSize: 24 }}>d</Text>
                                    <Text style={{ fontSize: 24 }}>e</Text>
                                    <Text style={{ fontSize: 24 }}>f</Text>
                                    <Text style={{ fontSize: 24 }}>g</Text>
                                    <Text style={{ fontSize: 24 }}>a</Text>
                                    <Text style={{ fontSize: 24 }}>b</Text>
                                    <Text style={{ fontSize: 24 }}>c</Text>
                                    <Text style={{ fontSize: 24 }}>d</Text>
                                    <Text style={{ fontSize: 24 }}>e</Text>
                                    <Text style={{ fontSize: 24 }}>f</Text>
                                    <Text style={{ fontSize: 24 }}>g</Text>
                                    <Text style={{ fontSize: 24 }}>a</Text>
                                    <Text style={{ fontSize: 24 }}>b</Text>
                                    <Text style={{ fontSize: 24 }}>c</Text>
                                    <Text style={{ fontSize: 24 }}>d</Text>
                                    <Text style={{ fontSize: 24 }}>e</Text>
                                    <Text style={{ fontSize: 24 }}>f</Text>
                                    <Text style={{ fontSize: 24 }}>g</Text>

                                </ScrollView>
                        </View>
                        
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setVisible()}>
                                <Text style={styles.textStyle}>No</Text>
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
    backgroundColor: 'white',
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
    textAlign: 'center',
  },

});