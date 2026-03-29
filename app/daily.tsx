import { QuoteProvider } from "@/components/QuoteContext";
import useUserSettings from "@/hooks/useUserSettings";
import { Button, Dimensions, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Daily() {

    const { createBackup, showBackup, resetSettings, clearQuotes, restoreFromBackup } = useUserSettings();

    
    return (
        <QuoteProvider>
            <View style={{ flex: 1 , backgroundColor: '#25292e', gap:20 }}>
                <Button onPress={showBackup} title="Show Backup"/>
                <Button onPress={createBackup} title="Create Backup"/>
                <Button onPress={resetSettings} title="Reset"/>
                <Button onPress={clearQuotes} title="Clear Quotes"/>
                <Button onPress={restoreFromBackup} title="Restore Backup"/>
            </View>
        </QuoteProvider>
    )
}
