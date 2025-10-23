import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Language } from '@/types/dictionary';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  languages: Language[];
  onSelect: (language: Language) => void;
  label: string;
  isDarkMode?: boolean;
}

export default function LanguageSelector({ 
  selectedLanguage, 
  languages, 
  onSelect,
  label,
  isDarkMode = false
}: LanguageSelectorProps) {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleSelect = (language: Language) => {
    onSelect(language);
    setModalVisible(false);
  };

  return (
    <View className="flex-1">
      <Text className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{label}</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border px-4 py-3 flex-row items-center justify-between`}
      >
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-2">{selectedLanguage.flag}</Text>
          <Text className={`text-base font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`} numberOfLines={1}>
            {selectedLanguage.name}
          </Text>
        </View>
        <ChevronDown size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl max-h-[70%]`}>
            <View className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Text className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{label}</Text>
            </View>
            <ScrollView className="px-4">
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => handleSelect(language)}
                  className={`flex-row items-center justify-between py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
                >
                  <View className="flex-row items-center flex-1">
                    <Text className="text-2xl mr-3">{language.flag}</Text>
                    <View className="flex-1">
                      <Text className={`text-base font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {language.name}
                      </Text>
                      <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {language.nativeName}
                      </Text>
                    </View>
                    {language.isPremium && !language.isDownloaded && (
                      <View className={`${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'} px-2 py-1 rounded-full mr-2`}>
                        <Text className={`text-xs font-semibold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Premium</Text>
                      </View>
                    )}
                  </View>
                  {selectedLanguage.code === language.code && (
                    <Check size={20} color={isDarkMode ? "#34D399" : "#10B981"} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <Text className={`text-center text-base font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}