import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function ThemeModel({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {

    const [ themeSelection, setThemeSelection ] = useState("light");

    useEffect(() => {
        getThemeFromSettings();
    },[]);

    const handleTheme = (x: string) => {
        setThemeSelection(x);
    }

    const getThemeFromSettings = async () => {
        
        let x = await AsyncStorage.getItem("settings");

        if(x !== null) {
            x = JSON.parse(x);
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
                        <Text style={[styles.modalText, {fontSize: 22}]}>Theme Modal</Text>
                        <View style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '15%'}}>
                            
                            <View style={styles.modalRadioContainer}>
                                <Text style={{ flex: .8 }}>Light</Text>
                                <Pressable style={{ flex: .2,  alignItems: 'center', justifyContent: 'center' }} onPress={() => handleTheme("light")}>
                                    {themeSelection == "light" ? 
                                        <FontAwesome name="circle-thin" size={15} color="orange"/>
                                        :
                                        <FontAwesome name="circle" size={15} color="black"/>
                                    }
                                </Pressable>
                            </View>

                            <View style={styles.modalRadioContainer}>
                                <Text style={{ flex: .8 }}>Dark</Text>
                                <Pressable style={{ flex: .2,  alignItems: 'center', justifyContent: 'center' }} onPress={() => handleTheme("dark")}>
                                    {themeSelection == "dark" ? 
                                        <FontAwesome name="circle-thin" size={15} color="orange"/>
                                        :
                                        <FontAwesome name="circle" size={15} color="black"/>
                                    }
                                </Pressable>
                            </View>

                            <View style={styles.modalRadioContainer}>
                                <Text style={{ flex: .8 }}>System Default</Text>
                                <Pressable style={{ flex: .2, alignItems: 'center', justifyContent: 'center' }} onPress={() => handleTheme("default")}>
                                    {themeSelection == "default" ? 
                                        <FontAwesome name="circle-thin" size={15} color="orange"/>
                                        :
                                        <FontAwesome name="circle" size={15} color="black"/>
                                    }
                                </Pressable>
                            </View>
                        </View>
                        
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 15, position: 'absolute', top: '90%'}}>
                            <Pressable style={[ styles.button , styles.buttonClose]} onPress={setVisible}>
                                <Text>Close</Text>
                            </Pressable>

                            <Pressable style={[ styles.button, styles.buttonOpen]}>
                                <Text>Save</Text>
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
    position: 'relative',
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
  modalRadioContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 5
  }
});
