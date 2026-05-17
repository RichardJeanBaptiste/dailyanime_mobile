import useUserSettings from '@/hooks/useUserSettings';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function TutorialModel({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {

    const { setTutorialSettings } = useUserSettings();

    const setTutorialAgain = () => {
      setTutorialSettings(true)
      setVisible()

      // Push To Quotes Tutorial
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Tutorial</Text>
                      <Text style={styles.modalText}>Do you want to view the tutorial again?</Text>
                      <View style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setVisible()}>
                            <Text style={styles.textStyle}>No</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setTutorialAgain()}>
                            <Text style={styles.textStyle}>Yes</Text>
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
