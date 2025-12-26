import { Pressable, ViewStyle } from "react-native"

interface IconButtonProps {
    icon : any,
    onPress: () => void | Promise<void>,
    style?: ViewStyle | ViewStyle[]
}

export default function IconButton({icon, onPress, style} : IconButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                {
                    opacity: pressed ? 0.6 : 1,
                },
                style
            ]}
            onPress={onPress}
        >   
            {icon}    
        </Pressable>
    )
}