import 'dotenv/config';

export default {
    
    expo: {
        name: "dailyanime",
        slug: "dailyanime",
        owner: "richinbk",
        version: "1.0.0", // Ensure you have a version
        orientation: "portrait",
        icon: "./assets/images/icon.png", // Ensure this path is correct
        userInterfaceStyle: "light",
        scheme: "dailyanime",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.company.dailyanime",
            infoPlist: {
                "ITSAppUsesNonExemptEncryption": false
            }
        },
        android: {
            package: "com.richinbk.dailyanime", // <--- ADD THIS LINE
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: "com.company.dailyanime",
            googleServicesFile: "google-services.json"
        },
        plugins: [
            "expo-router",
            "expo-notifications",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        "backgroundColor": "#000000"
                    }
                }
            ]
        ],
        extra: {
            supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
            // You can also use non-prefixed vars here if you prefer
            router: {},
            "eas": {
                "projectId": "78ef26ba-4d80-482e-aaa3-941ec3d314d0",
                
            }
        }, 
    },
};