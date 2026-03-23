import { Button, Dimensions, Modal, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function NotificationModel({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {
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
                      <Text style={styles.modalText}>Notification Settings</Text>
                      <View style={{ backgroundColor: 'lightblue',display: 'flex', flexDirection: 'row', width: '100%', height: '100%'}}>
                        <View style={{ display: 'flex', flexDirection: 'column', flex: .7}}>
                          <Text>Daily</Text>
                          <Text>If checked you will </Text>
                        </View>

                        <Button
                          title="Select"
                        />
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
    width: SCREEN_WIDTH * .85,
    height: SCREEN_HEIGHT * .6,
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
