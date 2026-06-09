import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import useUserSettings from '../../hooks/useUserSettings';
import ThemeModal from './ThemeModal';

export default function Notifications() {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const [ themeModal, setThemeModal] =useState(false);
    
    const { userSettings, setNotifications, setNotificationTime, setSoundSettings } = useUserSettings();

    const handleNotificitations = (notification: boolean) => {
        setNotifications(notification);
    }

    const handleThemeModal = () => {
        setThemeModal(!themeModal);
    }
    
    const CheckMarkButton = () => {
        return (
            <View>
                {userSettings.isNotifications ? 
                    <Pressable onPress={() => setNotifications(false)}>
                        <MaterialCommunityIcons name="checkbox-outline" size={20} color="orange" />
                    </Pressable>
                    :
                    <Pressable onPress={() => setNotifications(true)}>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="white"/>
                    </Pressable>
                }
            </View>
        )
    }

    const SoundButton = () => {
        return (
            <View>
                {userSettings.isSoundOn ? 
                    <Pressable onPress={() => setSoundSettings(false)}>
                        <MaterialCommunityIcons name="checkbox-outline" size={20} color="orange" />
                    </Pressable>
                    :
                    <Pressable onPress={() => setSoundSettings(true)}>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="white"/>
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
                paddingBottom: '4%',
                display: 'flex',
                gap: 20
            }}
        >


            <ThemeModal modalVisible={themeModal} setVisible={handleThemeModal}/>

            <Text style={[styles.sText, {color: 'orange', fontSize: 18, marginLeft: '3%'}]}>Notifications</Text>

            <View style={[ { display: 'flex', flexDirection: 'row',  marginTop: '1%', marginLeft: '7%'} ]}>

                <View style={{display: 'flex', flexDirection: 'column', flex: .9, marginTop: '2%'}}>
                    <Text style={[ styles.sText, { fontSize: 16 }]}>Daily</Text>
                    <Text style={[ styles.sText, { fontSize: 13 }]}>If selected notifications will pop up daily</Text>
                </View>
                
                <View style={{ flex: .1 , marginTop: '2%' }}>
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
                <Text style={[ styles.sText, { fontSize: 16 }]}>Delivery Time</Text>
                <Text style={[ styles.sText, { marginTop: '2%'} ]}>What time do you want your daily notification?</Text>
                <Text style={[ styles.sText ]}>Current Delivery Time: {userSettings.NotificationTime}</Text>  
            </Pressable>   

            <View style={{ display: 'flex', flexDirection: 'row',  marginLeft: '7%' }}>
                <View style={{ display: 'flex', flexDirection: 'column', flex: .9 }}>
                    <Text style={[ styles.sText, { fontSize: 16 } ]}>Sound</Text>
                    <Text style={[ styles.sText, { fontSize: 13 } ]}>Notification sound when delivered</Text>
                </View>
                
                <View style={{ flex: .1, marginTop: '2%' }}>
                    <SoundButton/>
                </View>
            </View>

            {/** 
             * 
             *  <Pressable style={{ display: 'flex', flexDirection: 'column', marginLeft: '7%' }} onPress={handleThemeModal}>
                    <Text style={[ styles.sText ]}>Themes</Text>
                    <Text style={[ styles.sText ]}>Choose your color mode</Text>
                </Pressable>
             * 
            */}
            
               
        </View>
    )
}

const styles = StyleSheet.create({
    sContainer: {
        marginTop: '2%',
        marginLeft: '7%', 
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

