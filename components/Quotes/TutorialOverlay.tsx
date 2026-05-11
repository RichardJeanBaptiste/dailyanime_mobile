import useAppConstants from '@/hooks/useAppConstants';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, View } from 'react-native';

const titleDesc = `Here is where you can find the character name and the media the character is from.`

const modalDesc = `Here is the character image. You can click on this to find out more info about them.`

const quoteDesc = `Here you can see the current qoute.`

const swipeDesc = `Swipe right over here to get more quotes.\n Swipe left to see previous ones`

export default function TutorialOverlay() {

    const { SCREEN_WIDTH, SCREEN_HEIGHT } = useAppConstants();

    return (
        <View pointerEvents='none' style={[ {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}, styles.oContainer ]}>

            <View style={[styles.titleContainer, {width: SCREEN_WIDTH, height: SCREEN_HEIGHT * .15 }]}>

                <View style={{ flex: 1, position: 'relative' }}>
                    <View style={styles.titleTextContainer}>
                        <FontAwesome name="hand-o-down" size={20} color="white"/>
                        <Text style={[styles.text, {width: '60%', fontSize: 14} ]}>{titleDesc}</Text>
                    </View>
                </View>

            </View>

            <View style={[styles.qContainer, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * .26}]}>
                <View style={{ flex: 1, position: 'relative' }}>

                    <View style={{ display: 'flex', flexDirection: 'row', gap: 20, position: 'absolute', top: 0, left: '50%', transform:'translate(-50%, -50%)' }}>
                        <FontAwesome name="hand-o-down" size={20} color="white"/>
                        <Text style={styles.text}>{quoteDesc}</Text>
                    </View>
                    

                    
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 90, position:'absolute', bottom: 20, left: '50%', transform:'translate(-50%, -50%)'}}>
                        <FontAwesome name="hand-o-left" size={20} color="white"/>
                        <FontAwesome name="hand-o-right" size={20} color="white"/>
                    </View>
                    <Text style={[styles.text, { textAlign: 'center' }]}>{swipeDesc}</Text>
                </View>
            </View>

            <View style={styles.bContainer}>
                <Text style={styles.text}>Bookmark</Text>
                <Text style={styles.text}>Wiki</Text>
                <Text style={styles.text}>Bookmark</Text>
            </View>
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    oContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    titleContainer: {
        position: 'absolute',
        top: 5,
        left: 0,
    },
    titleTextContainer: {
        display: 'flex', 
        flexDirection: 'row', 
        gap: 10, 
        position: 'absolute', 
        top: 0,
        right: 30, 
        justifyContent: 'flex-end', 
        height: '65%', 
    },
    qContainer: {
        position: 'absolute',
        top: '35%',
    },
    bContainer: {
        position: 'absolute',
        top: '70%',
        left: '40%',
    },
    text: {
        color: 'white',
        fontSize: 12
    }
})