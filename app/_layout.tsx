import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StoreProvider } from '@/context/StoreContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { BookOpen, Star, Package, ShoppingBag, Settings } from 'lucide-react-native';
import { useStore } from '@/context/StoreContext';

function DrawerNavigator() {
  const { settings } = useStore();
  
  return (
    <>
      <StatusBar style={settings.darkMode ? "light" : "dark"} />
      <Drawer
        screenOptions={{
          headerTitleAlign: 'center',
          drawerActiveTintColor: '#4F46E5',
          drawerInactiveTintColor: settings.darkMode ? '#A1A1AA' : '#6B7280',
          headerStyle: {
            backgroundColor: settings.darkMode ? '#1F2937' : '#FFFFFF',
          },
          headerTintColor: settings.darkMode ? '#F9FAFB' : '#111827',
          drawerStyle: {
            backgroundColor: settings.darkMode ? '#111827' : '#FFFFFF',
          },
          drawerLabelStyle: {
            color: settings.darkMode ? '#F9FAFB' : '#111827',
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Dictionary',
            drawerIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="favorites"
          options={{
            drawerLabel: 'Favorites',
            title: 'Favorites',
            drawerIcon: ({ color, size }) => <Star size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="languages"
          options={{
            drawerLabel: 'Languages',
            title: 'Language Packages',
            drawerIcon: ({ color, size }) => <Package size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="store"
          options={{
            drawerLabel: 'Store',
            title: 'Premium Store',
            drawerIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
            drawerIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Drawer>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider>
        <ThemeProvider>
          <DrawerNavigator />
        </ThemeProvider>
      </StoreProvider>
    </GestureHandlerRootView>
  );
}