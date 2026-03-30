import useUserSettings from '@/hooks/useUserSettings';
import { Alert, Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function BackupModel({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {

    const { createBackup } = useUserSettings();

    const handleNewBackup = () => {
        try {
          createBackup();
          Alert.alert("New Backup Created");
          setVisible();
        } catch (error) {
          Alert.alert("Something went wrong when creating a new backup")
        }
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
                      <Text style={[ styles.modalText, {textAlign: 'center', fontSize: 22}]}>Backup</Text>

                      <Text style={[ styles.modalText, {textAlign: 'center', marginTop: '2%'}]}>
                          {`Creating a backup will save your current settings and quotes to your device but it will delete any previous backups created. \n\n Are you sure you want to continue?`}
                      </Text>

                      <View style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: '15%'}}>
                          <Pressable
                            style={[ styles.button, styles.buttonDanger ]}
                            onPress={() => setVisible()}
                          >
                            <Text>Cancel</Text>
                          </Pressable>

                          <Pressable
                            style={[ styles.button, styles.buttonOpen ]}
                            onPress={handleNewBackup}
                          >
                            <Text>Create</Text>
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
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonDanger: {
    backgroundColor: 'red',
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
