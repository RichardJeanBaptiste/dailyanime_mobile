import { QuoteProvider } from "@/components/QuoteContext";
import useUserSettings from "@/components/useUserSettings";
import { Button, Dimensions, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Daily() {

    const { createBackup, showBackup } = useUserSettings();

    
    return (
        <QuoteProvider>
            <View style={{ flex: 1 , backgroundColor: '#25292e'}}>
                <Button onPress={showBackup} title="Show Backup"/>
                <Button onPress={createBackup} title="Create Backup"/>
            </View>
        </QuoteProvider>
    )
}
