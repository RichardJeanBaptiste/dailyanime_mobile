import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import useUserSettings from '../../hooks/useUserSettings';

export default function Notifications() {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const { userSettings, setNotifications, setNotificationTime } = useUserSettings();
    
    const CheckMarkButton = () => {
        return (
            <View>
                {userSettings.isNotifications ? 
                    <Pressable onPress={() => setNotifications(false)}>
                        <MaterialCommunityIcons name="checkbox-outline" size={24} color="orange" />
                    </Pressable>
                    :
                    <Pressable onPress={() => setNotifications(true)}>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="white"/>
                    </Pressable>
                }
            </View>
        )
    }

   
    const timeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // event.type will be 'set' (user pressed OK) or 'dismissed' (user cancelled)
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
        }

        if(selectedDate){
            setNotificationTime(selectedDate);
        }
         
        // On Android, the picker doesn't close itself automatically
        setShow(false); 
    };

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

            <Text style={[styles.sText, {color: 'orange', fontSize: 18, marginLeft: '1%'}]}>Notifications</Text>

            <View style={[ styles.sContainer,{ display: 'flex', flexDirection: 'row'} ]}>
                <View style={{display: 'flex', flexDirection: 'column', flex: .8, marginTop: '2%'}}>
                    <Text style={[styles.sText, { fontSize: 14 }]}>Daily</Text>
                    <Text style={[styles.sText, { fontSize: 12 }]}>If selected notifications will pop up daily</Text>
                </View>
                
                <View style={{ flex: .2, marginTop: '3%' }}>
                    <CheckMarkButton />
                </View>
            </View>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="time"
                    is24Hour={false}
                    onChange={timeChange}
                />
            )}

            <Pressable style={[ styles.sContainer , { display: 'flex', flexDirection: 'column'} ]} onPress={() => setShow(!show)}>
                <Text style={[ styles.sText ]}>Delivery Time</Text>
                <Text style={[ styles.sText ]}>What time do you want your daily notification?</Text>
                <Text style={[ styles.sText ]}>Current Delivery Time: {userSettings.NotificationTime}</Text>
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

