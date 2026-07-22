import useAppConstants from '@/hooks/useAppConstants';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {

    const { SCREEN_WIDTH, SCREEN_HEIGHT } = useAppConstants();

    const IMAGE_SIZE = SCREEN_WIDTH * 0.25;

    return (
        <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT,  backgroundColor: '#25292e'}}>
            <View style={styles.l_container}>
                <View style={styles.title}>
                    <Image
                        style= {{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: IMAGE_SIZE / 2 }}
                        source={require('@/assets/images/anime_splash.jpg')}
                        contentFit="cover"
                        contentPosition={"center"}
                    />
                    <Text>Daily Anime</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    l_container: {
        flex: 1,
        position: 'relative'
    },
    title: {
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
