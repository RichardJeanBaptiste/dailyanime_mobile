import { QuoteProvider } from '@/components/Quotes/QuoteContext';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {

  const ReturnButton = () => {
    const router = useRouter();

    return (
      <Pressable onPress={() => router.back()}>
        <MaterialDesignIcons name="arrow-left-top-bold" color="white" size={20} />
      </Pressable>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <QuoteProvider>
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
              <MaterialDesignIcons name="home-variant-outline" size={17} color="white" />
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
            name="daily"
            options={{
              drawerLabel: 'Daily',
              drawerIcon: () => (
                <MaterialDesignIcons name="calendar" size={15} color="white" />
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
              <MaterialDesignIcons name="pocket" size={15} color="white" />
            ),
            drawerLabelStyle: {
              color: 'white'
            },
            title: '',
            headerStyle: {
              backgroundColor: '#25292e'
            },
            headerTintColor: 'white',
          }}
        />

        <Drawer.Screen
          name="characters"
          options={{
            drawerLabel: 'Characters',
            drawerIcon: () => (
              <MaterialDesignIcons name="face-man" size={15} color="white" />
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
            <MaterialDesignIcons name="account-settings" size={15} color="white" />
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
            <MaterialDesignIcons name="information-box" size={15} color="white" />
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
        name="test"
        options={{
          drawerLabel: 'test',
          drawerLabelStyle: {
            color: 'white'
          },
          title: '',
          drawerItemStyle: {
            display: 'flex'
          },
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

        <Drawer.Screen
          name="privacy"
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

        <Drawer.Screen
          name="terms"
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
      </QuoteProvider>
    </QueryClientProvider>
  )
}

