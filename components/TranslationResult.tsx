import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Volume2, Star, BookOpen } from 'lucide-react-native';
import { Translation } from '@/types/dictionary';
import { useStore } from '@/context/StoreContext';

interface TranslationResultProps {
  translation: Translation;
  onAddToFavorites: () => void;
  isFavorite: boolean;
  isDarkMode?: boolean;
}

export default function TranslationResult({ 
  translation, 
  onAddToFavorites,
  isFavorite,
  isDarkMode = false
}: TranslationResultProps) {
  const { settings } = useStore();

  const handlePronounce = () => {
    Alert.alert(
      'Pronunciation',
      `Playing pronunciation at ${settings.pronunciationSpeed} speed`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg shadow-black/10 p-6 border`}>
      {/* Word and Translation */}
      <View className="mb-4">
        <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Translation</Text>
        <Text className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
          {translation.translation}
        </Text>
        {translation.pronunciation && (
          <View className="flex-row items-center">
            <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} italic`}>
              /{translation.pronunciation}/
            </Text>
          </View>
        )}
      </View>

      {/* Part of Speech */}
      {translation.partOfSpeech && (
        <View className="mb-4">
          <View className={`${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} px-3 py-1 rounded-full self-start`}>
            <Text className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              {translation.partOfSpeech}
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row gap-3 mb-4">
        <TouchableOpacity 
          onPress={handlePronounce}
          className={`flex-1 ${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'} rounded-xl py-3 flex-row items-center justify-center`}
        >
          <Volume2 size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Pronounce</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onAddToFavorites}
          className={`flex-1 rounded-xl py-3 flex-row items-center justify-center ${
            isFavorite 
              ? 'bg-amber-500' 
              : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}
        >
          <Star 
            size={20} 
            color={isFavorite ? 'white' : isDarkMode ? '#D1D5DB' : '#6B7280'} 
            fill={isFavorite ? 'white' : 'none'} 
          />
          <Text className={`font-semibold ml-2 ${
            isFavorite 
              ? 'text-white' 
              : isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {isFavorite ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Examples */}
      {translation.examples && translation.examples.length > 0 && (
        <View>
          <View className="flex-row items-center mb-3">
            <BookOpen size={18} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
            <Text className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} ml-2`}>Examples</Text>
          </View>
          <View className="space-y-2">
            {translation.examples.map((example, index) => (
              <View key={index} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3`}>
                <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-5`}>{example}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}