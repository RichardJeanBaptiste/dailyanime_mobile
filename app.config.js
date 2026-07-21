import 'dotenv/config';

export default {
    expo: {
        name: "dailyanime",
        slug: "dailyanime",
        owner: "richinbk",
        version: "1.0.0", 
        orientation: "portrait",
        icon: "./assets/images/icon.png", 
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
            package: "com.richinbk.dailyanime", 
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png"
            },
            "usesCleartextTraffic": true,
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: "com.company.dailyanime",
            googleServicesFile: process.env.GOOGLE_SERVICES_FILE ?? './google-services.json'
        },
       "plugins": [
            "@react-native-community/datetimepicker",
            "expo-router",
            "expo-notifications",
            "expo-build-properties",
            "expo-font",
            "expo-image",
            "expo-status-bar",
            "expo-web-browser",
            [
                "expo-sqlite",
                {
                "enableFTS": true,
                "useSQLCipher": true,
                "android": {
                    "enableFTS": false,
                    "useSQLCipher": false
                },
                // "ios": {
                //     "customBuildFlags": [
                //     "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1"
                //     ]
                // }
                }
            ],
            [
                "expo-splash-screen",
                {
                "image": "./assets/images/splash-icon.png",
                "imageWidth": 200,
                "resizeMode": "contain",
                "backgroundColor": "#ffffff",
                "dark": {
                    "backgroundColor": "#000000"
                }
                }
            ],
            [
                "react-native-google-mobile-ads",
                {
                    "androidAppId": "ca-app-pub-4929537070408822~3908928179"
                }
            ]
        ],
        extra: {
            supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
            githubKey: process.env.EXPO_PUBLIC_GITHUB_KEY,
            bannerId: process.env.EXPO_PUBLIC_BANNER_ID,
            // You can also use non-prefixed vars here if you prefer
            router: {},
            "eas": {
                "projectId": "78ef26ba-4d80-482e-aaa3-941ec3d314d0",
                
            }
        }, 
    },
};