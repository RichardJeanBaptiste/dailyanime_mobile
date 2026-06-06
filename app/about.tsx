import ChangeLogModal from '@/components/About/changeLogModal';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function About() {

    const router = useRouter();

    const [ changeLogModal, setChangeLogModal ] = useState(false);

    const handleChangeModal = () => {
        setChangeLogModal(!changeLogModal);
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['right', 'bottom', 'left']}>
            <ScrollView
                contentContainerStyle= {{
                    width: screenWidth,
                    height: screenHeight,
                }}
            >
                <View style={styles.about_root}>

                    <View style={styles.about_title}>
                        <Image
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                marginTop: '7%'
                            }}
                            source={PlaceholderImage}
                        />
                        <Text style={[styles.text1, {marginTop: '4%'}]}>Daily Anime</Text>
                    </View>
                
                
                    <View style={styles.about_content}>
                        <View style={styles.about_items}>
                            <Text style={[ styles.text1 ]} >Ad Free / Pro version</Text>
                            <Text style={[ styles.text2 ]}>Remove all the ads on the app and support future development</Text>
                        </View>
                        
                        <View style={styles.about_items}>
                            <Text style={[ styles.text1]}>Rate App</Text>
                            <Text style={[ styles.text2]}>If like the app, give me a rating it helps alot</Text>
                        </View>

                        <View style={styles.about_items}>
                            <Text style={[ styles.text1 ]}>Report Bug</Text>
                            <Text style={[ styles.text2 ]}>Report bugs or request new features</Text>
                        </View>
                        
                        <Pressable style={styles.about_items} onPress={handleChangeModal}>
                            <Text style={[styles.text1]}>Change Logs</Text>
                            <Text style={[styles.text2]}>Updates to the app</Text>
                        </Pressable>
                        
                        {/** 
                            <View style={styles.about_items}>
                                <Text style={[styles.text1]}>FAQs</Text>
                            </View>
                        **/}
                        
                        
                        <Pressable onPress={() => router.push('/privacy')}>
                            <Text style={[styles.text1, styles.about_items, {marginTop: '-2%'}]}>Privacy Policy</Text>
                        </Pressable>
                        

                        <Pressable onPress={() => router.push('/terms')}>
                            <Text style={[styles.text1, styles.about_items, {marginTop: '-2%'}]}>Terms & Conditions</Text>
                        </Pressable>
                        
                        <ChangeLogModal modalVisible={changeLogModal} setVisible={handleChangeModal}/>
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    about_root : {
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#25292e'
    },
    text1: {
        color: 'white',
        fontSize: 20
    },
    text2: {
        color: 'white',
        fontSize: 14
    },
    about_title: {
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        justifyContent: 'center',
        alignItems: 'center',
        height: screenHeight * .2,
        width: screenWidth * .4
    },
    about_content: {
        position: 'absolute',
        top: '22%',
        left: '2%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    about_items: {
        height: screenHeight * .10,
        width: screenWidth * .95,
        marginTop: '2%'
    }
})