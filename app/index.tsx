import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftRight, BookOpen } from 'lucide-react-native';
import SearchBar from '@/components/SearchBar';
import LanguageSelector from '@/components/LanguageSelector';
import TranslationResult from '@/components/TranslationResult';
import RecentSearches from '@/components/RecentSearches';
import { AVAILABLE_LANGUAGES, searchTranslation } from '@/data/languages';
import { Translation, SearchHistory, Favorite, Language } from '@/types/dictionary';
import '../global.css';
import { useStore } from '@/context/StoreContext';
import { useTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<Language>(AVAILABLE_LANGUAGES[0]);
  const [targetLanguage, setTargetLanguage] = useState<Language>(AVAILABLE_LANGUAGES[1]);
  const [currentTranslation, setCurrentTranslation] = useState<Translation | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  const { languages, searchHistory, addSearch, clearHistory, addFavorite, favorites } = useStore();
  const { isDarkMode } = useTheme();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const translation = searchTranslation(
      searchQuery,
      sourceLanguage.code,
      targetLanguage.code
    );

    if (translation) {
      setCurrentTranslation(translation);
      setNotFound(false);
      
      // Add to search history
      const newSearch: SearchHistory = {
        id: Date.now().toString(),
        word: searchQuery,
        sourceLanguage: sourceLanguage.code,
        targetLanguage: targetLanguage.code,
        timestamp: Date.now(),
      };
      addSearch(newSearch);
    } else {
      setCurrentTranslation(null);
      setNotFound(true);
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setCurrentTranslation(null);
    setNotFound(false);
  };

  const handleAddToFavorites = () => {
    if (!currentTranslation) return;

    const existingFavorite = favorites.find(
      (fav) =>
        fav.word === currentTranslation.word &&
        fav.sourceLanguage === sourceLanguage.code &&
        fav.targetLanguage === targetLanguage.code
    );

    if (!existingFavorite) {
      const newFavorite: Favorite = {
        id: Date.now().toString(),
        word: currentTranslation.word,
        translation: currentTranslation.translation,
        sourceLanguage: sourceLanguage.code,
        targetLanguage: targetLanguage.code,
        timestamp: Date.now(),
      };
      addFavorite(newFavorite);
    }
  };

  const isFavorite = () => {
    if (!currentTranslation) return false;
    return favorites.some(
      (fav) =>
        fav.word === currentTranslation.word &&
        fav.sourceLanguage === sourceLanguage.code &&
        fav.targetLanguage === targetLanguage.code
    );
  };

  const handleSelectSearch = (search: SearchHistory) => {
    const sourceLang = AVAILABLE_LANGUAGES.find((lang) => lang.code === search.sourceLanguage);
    const targetLang = AVAILABLE_LANGUAGES.find((lang) => lang.code === search.targetLanguage);
    
    if (sourceLang && targetLang) {
      setSourceLanguage(sourceLang);
      setTargetLanguage(targetLang);
      setSearchQuery(search.word);
      
      const translation = searchTranslation(search.word, search.sourceLanguage, search.targetLanguage);
      if (translation) {
        setCurrentTranslation(translation);
        setNotFound(false);
      }
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <BookOpen size={32} color={isDarkMode ? "#818CF8" : "#4F46E5"} />
              <Text className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} ml-3`}>Dictionary</Text>
            </View>
            <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Translate words offline in multiple languages
            </Text>
          </View>

          {/* Search Bar */}
          <View className="mb-4">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search for a word..."
              isDarkMode={isDarkMode}
            />
          </View>

          {/* Language Selectors */}
          <View className="flex-row items-center gap-3 mb-6">
            <LanguageSelector
              selectedLanguage={sourceLanguage}
              languages={languages}
              onSelect={setSourceLanguage}
              label="From"
              isDarkMode={isDarkMode}
            />
            <TouchableOpacity
              onPress={handleSwapLanguages}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 shadow-sm mt-6`}
            >
              <ArrowLeftRight size={20} color={isDarkMode ? "#A1A1AA" : "#6B7280"} />
            </TouchableOpacity>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              languages={languages}
              onSelect={setTargetLanguage}
              label="To"
              isDarkMode={isDarkMode}
            />
          </View>

          {/* Translation Result */}
          {currentTranslation && (
            <View className="mb-6">
              <TranslationResult
                translation={currentTranslation}
                onAddToFavorites={handleAddToFavorites}
                isFavorite={isFavorite()}
                isDarkMode={isDarkMode}
              />
            </View>
          )}

          {/* Not Found Message */}
          {notFound && (
            <View className={`${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-100'} rounded-2xl p-6 mb-6 border`}>
              <Text className={`text-center ${isDarkMode ? 'text-red-300' : 'text-red-700'} font-semibold`}>
                Translation not found
              </Text>
              <Text className={`text-center ${isDarkMode ? 'text-red-400' : 'text-red-600'} text-sm mt-1`}>
                Try a different word or check if the language pack is downloaded
              </Text>
            </View>
          )}

          {/* Recent Searches */}
          <View className="mb-6">
            <RecentSearches
              searches={searchHistory.slice(0, 10)}
              onSelectSearch={handleSelectSearch}
              onClearHistory={clearHistory}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}