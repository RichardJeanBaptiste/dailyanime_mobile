
import useAppConstants from '@/hooks/useAppConstants';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


export default function ReportBugModal({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {

    const { SCREEN_WIDTH, SCREEN_HEIGHT } = useAppConstants(); 

    const [ reportForm, setReportForm ] = useState({
        title: '',
        description: '',
        appVersion: '',
        buildNumber: '',
        deviceModal: '',
        locale: ''
    })

    const handleChangeReport = (key: string, value: string) => {
        setReportForm((prev) => ({
            ...prev,
            [key]: value,
        }));
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
                        <Text style={[styles.modalText, {fontWeight: 'bold', fontSize: 20, textDecorationLine: 'underline' }]}>Report Bug</Text>

                        <View>
                            <TextInput placeholder="Title" value={reportForm.title} onChangeText={(text) => handleChangeReport('title', text)}/>
                            <TextInput placeholder="Description" value={reportForm.description} onChangeText={(text) => handleChangeReport('description', text)}/>
                            <TextInput placeholder="App Version" value={reportForm.appVersion} onChangeText={(text) => handleChangeReport('appVersion', text)}/>
                            <TextInput placeholder="Build Number" value={reportForm.buildNumber} onChangeText={(text) => handleChangeReport('buildNumber', text)}/>
                            <TextInput placeholder="Device Modal" value={reportForm.deviceModal} onChangeText={(text) => handleChangeReport('deviceModal', text)}/>
                            <TextInput placeholder="Locale" value={reportForm.locale} onChangeText={(text) => handleChangeReport('locale', text)}/>    
                        </View>

                        <Text onPress={() => console.log(reportForm)}>Test</Text>
                        
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