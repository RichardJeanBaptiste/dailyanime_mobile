import useAppConstants from '@/hooks/useAppConstants';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const titleDesc = `Here is where you can find the character name and the media the character is from.`

const modalDesc = `Here is the character image. You can click on this to find out more info about them.`

const quoteDesc = `Here you can see the current qoute.`

const swipeDesc = `Swipe left to get more quotes.`

const bookmarkDesc = `If you like a quote save it later by clicking here.`

const wikiDesc = `If you want more detailed info about a character you can go to their wiki page by clicking here.`

const shareDesc = `If you want to share this quote with others or on your socials click here.`



export default function TutorialOverlay({closeTutorial} : {closeTutorial: any}) {

    const { SCREEN_WIDTH, SCREEN_HEIGHT } = useAppConstants();

    const [tIndex, setTIndex] = useState(1);

    const updateIndex = () => {
        setTIndex((prev) => prev + 1);
    }

    const Tutorial0 = () => {
        return (
            <View/>
        )
    }

    const Tutorial1 = () => {
        return (
            <Pressable 
                style={[styles.titleContainer, {width: SCREEN_WIDTH, height: SCREEN_HEIGHT * .15 }]} 
                onPress={updateIndex}    
            >
                <View style={{ flex: 1, position: 'relative' }}>
                    <View style={styles.titleTextContainer}>
                        <FontAwesome name="hand-o-down" size={24} color="white"/>
                        <Text style={[styles.text, {width: '60%', height: '110%',fontSize: 16} ]}>{titleDesc}</Text>
                    </View>
                </View>
            </Pressable>            
        )
    }

    const Tutorial2 = () => {
        return (
            <Pressable 
                style={[styles.qContainer, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * .26}]}
                onPress={updateIndex}
            >
                <View style={{ flex: 1, position: 'relative' }}>
                    <View style={styles.qTextContainer1}>
                        <FontAwesome name="hand-o-down" size={22} color="white"/>
                        <Text style={[styles.text, {fontSize: 18} ]}>{quoteDesc}</Text>
                    </View>
                </View>
            </Pressable>       
        )
    }

    const Tutorial3 = () => {
        return (
            
            <Pressable 
                style={[styles.qContainer, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * .26}]}
                onPress={updateIndex}
            >
                <View style={{ flex: 1, position: 'relative' }}>

                    <View style={styles.qTextContainer2}>
                    
                        <View style={{ flex:.5, justifyContent: 'center', alignItems: 'center'}}>
                            <FontAwesome name="hand-o-right" size={20} color="white"/>
                            <Text style={[styles.text, styles.qBtnText ]}>{`Swipe right to get previous quotes`}</Text>
                        </View>


                        <View style={{ flex:.5 , justifyContent: 'center', alignItems: 'center'}}>
                            <FontAwesome name="hand-o-left" size={20} color="white"/>
                            <Text style={[styles.text, styles.qBtnText]}>{`Swipe left to get more quotes`}</Text>
                        </View> 
                    </View> 
                </View>
            </Pressable>
            
        )
    }

    const Tutorial4 = () => {
        return (
            <Pressable 
                style={[styles.bContainer, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * .1 }]}
                onPress={updateIndex}
            >
                <View style={{flex: 1, position: 'relative'}}>
                    <View style={[styles.btnTextContainer, {left: '6%', top: '20%'}]}>
                        <FontAwesome name="hand-o-up" size={20} color="white"/>
                        <Text style={[styles.text, {textAlign: 'center', width: '60%', height: '80%'}]}>{bookmarkDesc}</Text>
                    </View>
                </View>
            </Pressable> 
        )
    }

    const Tutorial5 = () => {
        return (
            <Pressable 
                style={[styles.bContainer, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * .1 }]}
                onPress={updateIndex}
            >
                <View style={{flex: 1, position: 'relative'}}>
                    <View style={[styles.btnTextContainer, {left: '-8%', top: '20%'}]}>
                        <FontAwesome name="hand-o-up" size={20} color="white"/>
                        <Text style={[styles.text, styles.bBtnText]}>{wikiDesc}</Text>
                    </View>
                </View>
            </Pressable>
        )
    }

    const handleLastClick = () => {
        updateIndex();
        closeTutorial();
        setTIndex(1);
    }

    const Tutorial6 = () => {
        return (
            <Pressable
                style={[styles.bContainer, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * .1 }]}
                onPress={handleLastClick}
            >
                <View style={{flex: 1, position: 'relative'}}>
                    <View style={[styles.btnTextContainer, {left: '21%', top: '20%'}]}>
                        <FontAwesome name="hand-o-up" size={20} color="white"/>
                        <Text style={[styles.text, styles.bBtnText]}>{shareDesc}</Text>
                    </View>
                </View>
            </Pressable> 
        )
    }

    const Tutorial = () => {
        switch(tIndex) {
            case 0: return <Tutorial0/>
            case 1: return <Tutorial1/>
            case 2: return <Tutorial2/>
            case 3: return <Tutorial3/>
            case 4: return <Tutorial4/>
            case 5: return <Tutorial5/>
            case 6: return <Tutorial6/>
            default: return null
        }
    }


    return (
        <View style={[ {width: SCREEN_WIDTH, height: SCREEN_HEIGHT}, styles.oContainer ]}>
           <Tutorial/>
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
        justifyContent: 'center',
        alignItems: 'center', 
        height: '65%', 
    },
    qContainer: {
        position: 'absolute',
        top: '35%',
    },
    qTextContainer1: {
        display: 'flex', 
        flexDirection: 'row', 
        gap: 20, 
        position: 'absolute', 
        top: '-10%', 
        left: '50%', 
        transform:'translate(-50%, -50%)' 
    },
    qTextContainer2: {
        display: 'flex', 
        flexDirection: 'row', 
        gap: 90, 
        position:'absolute', 
        bottom: "-45%", 
        left: '50%', 
        transform:'translate(-50%, -50%)'
    },
    qBtnText: {
        textAlign: 'center',
        width: '80%', 
        height: '100%', 
        marginTop: '2%'
    },
    bContainer: {
        position: 'absolute',
        top: '70%'
    },
    btnTextContainer: {
        position: 'absolute', 
        top: 5, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 10
    },
    bBtnText: {
        textAlign: 'center', 
        width: '60%', 
        height: '80%',
    },
    text: {
        color: 'white',
        fontSize: 12
    }
})