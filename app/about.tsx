import { Image } from 'expo-image';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const PlaceholderImage = require('@/assets/images/anime_splash.jpg');
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function About() {
    return (
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
                    
                    <View style={styles.about_items}>
                        <Text style={[styles.text1]}>Change Logs</Text>
                        <Text style={[styles.text2]}>Updates to the app</Text>
                    </View>
                    
                    <View style={styles.about_items}>
                        <Text style={[styles.text1]}>FAQs</Text>
                    </View>

                    <Text style={[styles.text1, styles.about_items, {marginTop: '-2%'}]}>Privacy Policy</Text>

                    <Text style={[styles.text1, styles.about_items, {marginTop: '-2%'}]}>Terms & Conditions</Text>
                    
                </View>
            </View>
        </ScrollView>
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