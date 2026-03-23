import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Notifications() {

    const [ dailySelected, setDailySelected] = useState(false);
    const [ modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
       getUserSettings();
    },[]);
    
    const getUserSettings = async () => {

        let x = await AsyncStorage.getItem("Settings");

        let items;

        if(x !== null) {
            items = JSON.parse(x);
        } else {
            console.log("No Settings Found");
            return
        }

        console.log(items);

        if(items.isNotifications == true){
            setDailySelected(true);
        }
    }

    const CheckMarkButton = ({pressed, setPressed} : {pressed: any, setPressed: any}) => {

        const startNotifications = async () => {

            setPressed(!pressed);

            let x = await AsyncStorage.getItem("Settings");
            let items;

            if(x !== null) {
                items = JSON.parse(x);
            }

            items.isNotifications = true;
            await AsyncStorage.setItem("Settings", JSON.stringify(items));
        }


        const stopNotifications = async () => {

            setPressed(!pressed);

            let x = await AsyncStorage.getItem("Settings");
            let items;

            if(x !== null) {
                items = JSON.parse(x);
            }

            items.isNotificationsOn = false; 
            
            await AsyncStorage.setItem("Settings", JSON.stringify(items));
        }

        return (
            <View>
                {pressed ? 
                    <Pressable onPress={() => startNotifications()}>
                        <MaterialCommunityIcons name="checkbox-outline" size={24} color="orange" />
                    </Pressable>
                    :
                    <Pressable onPress={() => stopNotifications()}>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="white"/>
                    </Pressable>
                }
            </View>
        )
    }

    return (
        <View
            style={{
                borderStyle: 'solid',
                borderColor: 'white',
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: .3,
                paddingTop: '3%',
                paddingBottom: '4%'
            }}
        >

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                    {DateTimePickerAndroid.open({
                        value: new Date(),
                        mode: 'time', // 'date' | 'time'
                    })}
    
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                    </View>
                </View>
            </Modal>

            <Text style={[styles.sText, {color: 'orange', fontSize: 18, marginLeft: '1%'}]}>Notifications</Text>

            <View style={[ styles.sContainer,{ display: 'flex', flexDirection: 'row'} ]}>
                <View style={{display: 'flex', flexDirection: 'column', flex: .8, marginTop: '2%'}}>
                    <Text style={[styles.sText, { fontSize: 14 }]}>Daily</Text>
                    <Text style={[styles.sText, { fontSize: 12 }]}>If selected notifications will pop up daily</Text>
                </View>
                
                <View style={{ flex: .2, marginTop: '3%' }}>
                    <CheckMarkButton pressed={dailySelected} setPressed={setDailySelected}/>
                </View>
            </View>

            <Pressable style={[ styles.sContainer , { display: 'flex', flexDirection: 'column'} ]} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={[ styles.sText ]}>Delivery Time</Text>
                <Text style={[ styles.sText ]}>What time do you want your daily notification?</Text>
            </Pressable>        
        </View>
    )
}

const styles = StyleSheet.create({
    sContainer: {
        marginTop: '2%',
        marginLeft: '2%', 
    },
    sText: {
        color : 'white'
    },
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
  }
})