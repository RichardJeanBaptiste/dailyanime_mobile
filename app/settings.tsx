import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';


const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;



export default function Settings() {

    const SettingItem = ({icon, title, info}: {icon: any, title: string, info: string}) => {
        return (
            <View style={styles.settings_item}>
                <View style={{flex : .2 }}>

                    {icon === "" ? (
                        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{
                                    width: screenWidth * .13,
                                    height: screenHeight * .06,
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
        <View style={styles.settings_root}>
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
            
                <SettingItem 
                    icon={<FontAwesome6 name="chalkboard" size={22} color="white" />}
                    title="Tutorial" 
                    info="Learn all the features of the app again"
                />

                <SettingItem 
                    icon={<FontAwesome6 name="clock" size={22} color="white" />}
                    title="Notifications" 
                    info="Configure your daily notification schedule"
                />

                <SettingItem 
                    icon={<FontAwesome name="save" size={22} color="white" />}
                    title="Backup" 
                    info="Backup your saved bookmarks and settings"
                />

                <SettingItem 
                    icon={<FontAwesome name="repeat" size={22} color="white" />} 
                    title="Restore" 
                    info="Restore your bookmarks and settings"
                />

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    settings_root: {
        flex: 1,
        backgroundColor: '#25292e'
    },
    sc_container: {
        width: '95%',
        height: '95%'
    },
    settings_item: {
        width: screenWidth * .95,
        height: screenHeight * .14,
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
        width: screenWidth * .15,
        height: screenHeight * .07
    },
    settings_text : {
        flex: .8,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }
})