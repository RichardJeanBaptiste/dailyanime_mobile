import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {

  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#25292e',
          width: 200,
        }
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home',
          drawerIcon: () => (
            <FontAwesome name="home" size={17} color="white" />
          ),
          drawerLabelStyle: {
            color: 'white'
          },
          title: '',
          headerStyle: {
            backgroundColor: '#25292e'
          },
          headerTintColor: 'white'
        }}
      />

      <Drawer.Screen
        name="bookmarks"
        options={{
          drawerLabel: 'Bookmarks',
          drawerIcon: () => (
            <FontAwesome name="get-pocket" size={15} color="white" />
          ),
          drawerLabelStyle: {
            color: 'white'
          },
          title: '',
          headerStyle: {
            backgroundColor: '#25292e'
          },
          headerTintColor: 'white'
        }}
      />

      <Drawer.Screen
        name="characters"
        options={{
          drawerLabel: 'Characters',
          drawerIcon: () => (
            <FontAwesome name="user" size={15} color="white" />
          ),
          drawerLabelStyle: {
            color: 'white'
          },
          title: '',
          headerStyle: {
            backgroundColor: '#25292e'
          },
          headerTintColor: 'white'
        }}
      />

      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: 'About',
          drawerIcon: () => (
            <FontAwesome name="info-circle" size={15} color="white" />
          ),
          drawerLabelStyle: {
            color: 'white'
          },
          title: '',
          headerStyle: {
            backgroundColor: '#25292e'
          },
          headerTintColor: 'white'
        }}
      />


      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          drawerIcon: () => (
            <FontAwesome name="gear" size={15} color="white" />
          ),
          drawerLabelStyle: {
            color: 'white'
          },
          title: '',
          headerStyle: {
            backgroundColor: '#25292e'
          },
          headerTintColor: 'white'
        }}
      />

      <Drawer.Screen
        name="query/[character]"
        options={{
          drawerLabel: '',
          drawerLabelStyle: {
            color: 'white'
          },
          drawerItemStyle: {
            display: 'none'
          },
          title: '',
          headerStyle: {
            backgroundColor: '#25292e'
          },
          headerTintColor: 'white'
        }}
      />
    </Drawer>
  )
}


