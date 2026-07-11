import useUserSettings from '@/hooks/useUserSettings';
import { Alert, Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function ResetModel({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {

    const { resetSettings } = useUserSettings();

    const restoreAndClose= () => {
      resetSettings();
      Alert.alert("App restored from backup, reload may be required");
      setVisible();
    }

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setVisible();
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Text style={[styles.modalText, {fontSize: 22}]}>Reset</Text>
                    <Text style={[ styles.modalText ]}>{`Pressing 'reset' will return your app to the default settings. \n\n Are you sure you want to continue?`}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: '15%'}}>
                        <Pressable
                          style={[ styles.button, styles.buttonDanger ]}
                          onPress={() => setVisible()}
                        >
                          <Text>Cancel</Text>
                        </Pressable>

                        <Pressable
                          style={[ styles.button, styles.buttonOpen ]}
                          onPress={restoreAndClose}
                        >
                          <Text>Reset</Text>
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
    width: SCREEN_WIDTH * .7,
    height: SCREEN_HEIGHT * .45,
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
  buttonDanger: {
    backgroundColor: 'red',
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
