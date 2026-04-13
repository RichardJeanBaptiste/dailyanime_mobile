import Notifications from '@/components/Settings/Notifications';
import Restore from '@/components/Settings/Restore';
import RestoreModel from '@/components/Settings/RestoreModal';
import TutorialModel from '@/components/Settings/TutorialModal';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;


export default function Settings() {

    const [ tutorialModal, setTutorialModal ] = useState(false);

    const [ notificationModal, setNotificationModal ] = useState(false);

    const [ restoreModal, setRestoreModal ] = useState(false);

    const setTModal = () => {
        setTutorialModal(!tutorialModal);
    }

    const setNModel = () => {
        setNotificationModal(!notificationModal);
    }

   
    const setRModal = () => {
        setRestoreModal(!restoreModal);
    }

    const SettingItem = ({icon, title, info}: {icon: any, title: string, info: string}) => {
        return (
            <View style={styles.settings_item}>
                <View style={{flex : .2 }}>

                    {icon === "" ? (
                        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{
                                    width: SCREEN_WIDTH * .13,
                                    height: SCREEN_HEIGHT * .06,
                                    borderRadius: 75,
                                }}
                                source={PlaceholderImage}
                            />
                        </View>
                    ) : (
                        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {icon}
                        </View>
                    )}
                    
                </View>
                
                <View style={styles.settings_text}>
                    <Text style={{marginTop: '7%', fontSize: 18, fontWeight: 'bold', color: 'white'}}>{title}</Text>
                    <Text style={{marginTop: '3%', fontSize: 14, color: 'white'}}>{info}</Text>
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.settings_root}>
            
            <TutorialModel modalVisible={tutorialModal} setVisible={setTModal}/>

            <RestoreModel modalVisible={restoreModal} setVisible={setRModal}/>

            <ScrollView
                contentContainerStyle= {
                    styles.sc_container
                }
            >
                <SettingItem 
                    icon=""
                    title="Daily Anime" 
                    info="A showcase of all the wisdom shared by animated characters"
                />

                <Pressable onPress={() => setTModal()}>
                    <SettingItem 
                        icon={<FontAwesome6 name="chalkboard" size={22} color="white" />}
                        title="Tutorial" 
                        info="Learn all the features of the app again"
                    />
                </Pressable>
                
                
                <Notifications/>
               
                <Restore/>
                
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    settings_root: {
        backgroundColor: '#25292e'
    },
    sc_container: {
        flex: 1,
        width: SCREEN_WIDTH * .9,
        height: SCREEN_HEIGHT,
        alignSelf: 'center', 
        marginTop: 0,
        paddingBottom: 20
    },
    settings_item: {
        width: SCREEN_WIDTH * .95,
        height: SCREEN_HEIGHT * .14,
        display: 'flex',
        flexDirection: 'row',
        marginTop: '2%',
        borderStyle: 'solid',
        borderColor: 'white',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: .3
    },
    settings_image: {
        width: SCREEN_WIDTH * .15,
        height: SCREEN_HEIGHT * .07
    },
    settings_text : {
        flex: .8,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }
})
