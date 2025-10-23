import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useStore } from './StoreContext';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useStore();
  const colorScheme = useColorScheme();
  
  // Initialize dark mode based on device settings if not explicitly set
  useEffect(() => {
    if (colorScheme === 'dark' && settings.darkMode === false) {
      updateSettings({ darkMode: true });
    }
  }, []);

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode: settings.darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}