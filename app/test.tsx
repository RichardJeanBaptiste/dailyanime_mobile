import useUserSettings from '@/hooks/useUserSettings';
import { Text, View } from 'react-native';

export default function Test() {

    const { userSettings, setTutorialSettings } = useUserSettings();

    return (
        <View style={{ flex: 1, backgroundColor: '#25292e', gap: 25}}>
            <Text style={{ color: 'white', fontSize: 24, textAlign: 'center' }} >Test Screen</Text>

            <Text 
                style={{ color: 'white', fontSize: 16 }}
                onPress={() => console.log(userSettings)}
            >
                Tutorial
            </Text>

            <Text
                style={{color: 'white', fontSize: 16}}
                onPress={() => setTutorialSettings(false)}
            >
                Tutorial False
            </Text>

            <Text
                style={{color: 'white', fontSize: 16}}
                onPress={() => setTutorialSettings(true)}
            >
                Tutorial True
            </Text>
        </View>
    )
}
