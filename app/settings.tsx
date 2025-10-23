import React from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Moon, Sun, Volume2, Save, Trash2 } from 'lucide-react-native';
import { useStore } from '@/context/StoreContext';
import { useTheme } from '@/context/ThemeContext';
import '../global.css';

export default function SettingsScreen() {
  const { settings, updateSettings, clearHistory } = useStore();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const handleClearHistory = () => {
    Alert.alert(
      'Clear Search History',
      'Are you sure you want to clear your search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearHistory();
            Alert.alert('Success', 'Search history has been cleared');
          }
        }
      ]
    );
  };

  const handlePronunciationSpeedChange = (speed: 'slow' | 'normal' | 'fast') => {
    updateSettings({ pronunciationSpeed: speed });
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Settings size={32} color={isDarkMode ? "#818CF8" : "#4F46E5"} />
              <Text className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} ml-3`}>Settings</Text>
            </View>
            <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Customize your dictionary experience
            </Text>
          </View>

          {/* Theme Settings */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-sm`}>
            <Text className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Appearance</Text>
            
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                {isDarkMode ? (
                  <Moon size={24} color="#818CF8" />
                ) : (
                  <Sun size={24} color="#4F46E5" />
                )}
                <Text className={`text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} ml-3`}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                thumbColor={isDarkMode ? '#4F46E5' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Pronunciation Settings */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-sm`}>
            <Text className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Pronunciation</Text>
            
            <View className="flex-row items-center mb-4">
              <Volume2 size={24} color={isDarkMode ? "#818CF8" : "#4F46E5"} />
              <Text className={`text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} ml-3`}>Pronunciation Speed</Text>
            </View>
            
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                onPress={() => handlePronunciationSpeedChange('slow')}
                className={`px-4 py-2 rounded-lg ${
                  settings.pronunciationSpeed === 'slow' 
                    ? isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'
                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`${
                    settings.pronunciationSpeed === 'slow' 
                      ? isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } font-medium`}
                >
                  Slow
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handlePronunciationSpeedChange('normal')}
                className={`px-4 py-2 rounded-lg ${
                  settings.pronunciationSpeed === 'normal' 
                    ? isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'
                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`${
                    settings.pronunciationSpeed === 'normal' 
                      ? isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } font-medium`}
                >
                  Normal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handlePronunciationSpeedChange('fast')}
                className={`px-4 py-2 rounded-lg ${
                  settings.pronunciationSpeed === 'fast' 
                    ? isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'
                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`${
                    settings.pronunciationSpeed === 'fast' 
                      ? isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } font-medium`}
                >
                  Fast
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auto-Save Settings */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-sm`}>
            <Text className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Search Options</Text>
            
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Save size={24} color={isDarkMode ? "#818CF8" : "#4F46E5"} />
                <Text className={`text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} ml-3`}>Auto-save searches</Text>
              </View>
              <Switch
                value={settings.autoSave}
                onValueChange={(value) => updateSettings({ autoSave: value })}
                trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                thumbColor={settings.autoSave ? '#4F46E5' : '#f4f3f4'}
              />
            </View>
            
            <TouchableOpacity
              onPress={handleClearHistory}
              className={`flex-row items-center mt-2 p-3 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} rounded-lg`}
            >
              <Trash2 size={20} color={isDarkMode ? "#F87171" : "#EF4444"} />
              <Text className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} ml-2 font-medium`}>Clear Search History</Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-sm`}>
            <Text className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>About</Text>
            <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Offline Multilingual Dictionary</Text>
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}